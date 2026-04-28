import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const clientDist = path.join(repoRoot, 'client', 'dist');
const args = new Set(process.argv.slice(2));
const jsonOutput = args.has('--json');
const failOnBlocked = args.has('--fail-on-blocked');

const patientPwaFiles = [
  'patient.webmanifest',
  'patient-sw.js',
  'patient-icon.svg',
  'patient-icon-192.png',
  'patient-icon-512.png',
];

const results = [];

function record(gate, status, detail) {
  results.push({ gate, status, detail });
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readText(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

async function verifyPatientOutput(name) {
  const outDir = path.join(clientDist, name);
  const indexPath = path.join(outDir, 'index.html');
  const manifestPath = path.join(outDir, 'patient.webmanifest');
  const indexHtml = await readText(indexPath);
  const manifestText = await readText(manifestPath);
  const missingFiles = [];

  for (const filename of ['index.html', ...patientPwaFiles]) {
    if (!(await exists(path.join(outDir, filename)))) missingFiles.push(filename);
  }

  if (missingFiles.length > 0) {
    record(
      `local:${name}`,
      'fail',
      `Missing built files in client/dist/${name}: ${missingFiles.join(', ')}`,
    );
    return;
  }

  const failures = [];
  if (!indexHtml?.includes('<title>Remote Assessment</title>')) {
    failures.push('patient title');
  }
  if (!indexHtml?.includes('rel="manifest" href="/patient.webmanifest"')) {
    failures.push('manifest link');
  }
  if (!indexHtml?.includes('name="apple-mobile-web-app-capable" content="yes"')) {
    failures.push('iOS PWA metadata');
  }
  try {
    const manifest = JSON.parse(manifestText ?? '{}');
    if (manifest.name !== 'Remote Assessment') failures.push('manifest name');
    if (manifest.short_name !== 'Assessment') failures.push('manifest short_name');
    if (manifest.start_url !== '/#/') failures.push('manifest start_url');
    if (manifest.scope !== '/') failures.push('manifest scope');
    if (manifest.display !== 'standalone') failures.push('manifest display');
  } catch {
    failures.push('manifest JSON');
  }

  if (failures.length > 0) {
    record(`local:${name}`, 'fail', `Invalid patient output: ${failures.join(', ')}`);
    return;
  }

  record(`local:${name}`, 'pass', `client/dist/${name} has patient PWA shell assets`);
}

async function verifyClinicianOutput() {
  const outDir = path.join(clientDist, 'clinician');
  const indexPath = path.join(outDir, 'index.html');
  const indexHtml = await readText(indexPath);
  const failures = [];

  if (!(await exists(indexPath))) failures.push('missing index.html');
  if (!indexHtml?.includes('<title>Remote Check</title>')) failures.push('clinician title');
  if (indexHtml?.includes('patient.webmanifest')) failures.push('patient manifest leak');
  if (indexHtml?.includes('apple-mobile-web-app-capable')) failures.push('patient iOS metadata leak');

  for (const filename of patientPwaFiles) {
    if (await exists(path.join(outDir, filename))) failures.push(`unexpected ${filename}`);
  }

  if (failures.length > 0) {
    record('local:clinician', 'fail', `Invalid clinician output: ${failures.join(', ')}`);
    return;
  }

  record('local:clinician', 'pass', 'client/dist/clinician excludes patient PWA assets');
}

function recordExternalGates() {
  const patientStagingUrl = process.env.PATIENT_STAGING_URL;
  const clinicianStagingUrl = process.env.CLINICIAN_STAGING_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  const realDeviceEvidence = process.env.PATIENT_PWA_REAL_DEVICE_EVIDENCE;

  record(
    'external:hosted-staging',
    patientStagingUrl && clinicianStagingUrl ? 'manual' : 'blocked',
    patientStagingUrl && clinicianStagingUrl
      ? `Staging URLs provided; verify HTTPS, route fallback, manifest, service worker, and clinician-route redirect manually: ${patientStagingUrl} / ${clinicianStagingUrl}`
      : 'Set PATIENT_STAGING_URL and CLINICIAN_STAGING_URL after deployment, then run hosted smoke checks from docs/PATIENT_PWA_PILOT_READINESS.md',
  );

  record(
    'external:licensed-stimuli',
    supabaseUrl && serviceKey ? 'manual' : 'blocked',
    supabaseUrl && serviceKey
      ? 'Supabase credentials are present; run node scripts/verify-stimuli.mjs --all-versions against the intended project'
      : 'Requires SUPABASE_URL plus SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY after licensed assets are uploaded',
  );

  record(
    'external:real-device',
    realDeviceEvidence ? 'manual' : 'blocked',
    realDeviceEvidence
      ? `Real-device evidence note provided: ${realDeviceEvidence}`
      : 'Requires installed-PWA iPad/tablet QA plus phone fallback testing on target devices',
  );
}

function printReport() {
  if (jsonOutput) {
    console.log(JSON.stringify({ results }, null, 2));
    return;
  }

  console.log('Patient PWA readiness report');
  for (const result of results) {
    console.log(`- [${result.status}] ${result.gate}: ${result.detail}`);
  }
}

await verifyPatientOutput('patient');
await verifyPatientOutput('patient-staging');
await verifyClinicianOutput();
recordExternalGates();
printReport();

const hasFailure = results.some((result) => result.status === 'fail');
const hasBlocked = results.some((result) => result.status === 'blocked');
if (hasFailure || (failOnBlocked && hasBlocked)) {
  process.exitCode = 1;
}
