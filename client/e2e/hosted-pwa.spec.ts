import { expect, test, type APIRequestContext, type APIResponse } from '@playwright/test';

const patientStagingUrl = process.env.PATIENT_STAGING_URL;
const clinicianStagingUrl = process.env.CLINICIAN_STAGING_URL;
const hostedSupabaseUrl = process.env.HOSTED_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;

test.describe('hosted patient PWA staging', () => {
  test.skip(
    !patientStagingUrl || !clinicianStagingUrl,
    'Set PATIENT_STAGING_URL and CLINICIAN_STAGING_URL to run hosted staging smoke checks.',
  );

  test('serves the patient PWA shell from HTTPS and hides clinician routes', async ({ page, request }) => {
    const patientUrl = requireHttpsUrl(patientStagingUrl!, 'PATIENT_STAGING_URL');

    await page.goto(patientUrl.href);

    await expect(page).toHaveTitle('Remote Assessment');
    await expect(page.getByRole('heading', { name: 'הערכה קוגניטיבית' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'כניסת מטופל' })).toBeVisible();
    await expect(page.getByText('מצב בדיקה')).toBeVisible();
    await expect(page.getByText('מומלץ לפתוח ממסך הבית')).toBeVisible();
    await expect(page.getByLabel('מספר מבדק בן 8 ספרות')).toBeVisible();

    const manifest = await request.get(new URL('/patient.webmanifest', patientUrl).href);
    expect(manifest.ok()).toBe(true);
    const manifestJson = await manifest.json();
    expect(manifestJson.icons).toEqual(expect.arrayContaining([expect.objectContaining({ src: expect.any(String) })]));
    for (const icon of manifestJson.icons) {
      const iconResponse = await request.get(new URL(icon.src, patientUrl).href);
      expect(iconResponse.ok()).toBe(true);
    }
    expect(manifestJson).toEqual(
      expect.objectContaining({
        name: 'Remote Assessment',
        short_name: 'Assessment',
        start_url: '/#/',
        scope: '/',
        display: 'standalone',
      }),
    );

    const serviceWorker = await request.get(new URL('/patient-sw.js', patientUrl).href);
    expect(serviceWorker.ok()).toBe(true);
    expect(serviceWorker.headers()['content-type']).toMatch(/javascript|text\/plain|octet-stream/);

    await page.goto(new URL('/#/clinician/auth', patientUrl).href);
    await expect(page).toHaveURL(/\/#\/$/);
    await expect(page.getByRole('heading', { name: 'כניסת מטופל' })).toBeVisible();
    await expect(page.getByRole('link', { name: /כניסה לקלינאים/ })).toHaveCount(0);
  });

  test('serves the clinician website separately from the patient PWA assets', async ({ page, request }) => {
    const clinicianUrl = requireHttpsUrl(clinicianStagingUrl!, 'CLINICIAN_STAGING_URL');

    await page.goto(new URL('/#/clinician/auth', clinicianUrl).href);

    await expect(page).toHaveTitle('Remote Check');
    await expect(page.getByRole('heading', { name: 'פורטל קלינאים' })).toBeVisible();
    await expect(page.getByRole('button', { name: /כניסה לקלינאים/ })).toBeVisible();

    const manifest = await request.get(new URL('/patient.webmanifest', clinicianUrl).href);
    await expectNotPatientAsset(manifest, ['"Remote Assessment"', '"display"', '"standalone"']);

    const serviceWorker = await request.get(new URL('/patient-sw.js', clinicianUrl).href);
    await expectNotPatientAsset(serviceWorker, ['patient-pwa-v', 'patient-shell', 'self.addEventListener']);
  });

  test('allows hosted browser origins to call Supabase Edge Functions', async ({ request }) => {
    if (!hostedSupabaseUrl) {
      throw new Error('Set HOSTED_SUPABASE_URL or VITE_SUPABASE_URL to validate hosted Edge Function CORS.');
    }

    const supabaseUrl = requireHttpsUrl(hostedSupabaseUrl, 'HOSTED_SUPABASE_URL');
    await expectAllowedFunctionOrigin(request, supabaseUrl, 'create-session', clinicianStagingUrl!);
    await expectAllowedFunctionOrigin(request, supabaseUrl, 'start-session', patientStagingUrl!);
  });
});

function requireHttpsUrl(value: string, name: string): URL {
  const url = new URL(value);
  if (url.protocol !== 'https:') {
    throw new Error(`${name} must use https:// for hosted PWA validation`);
  }
  return url;
}

async function expectNotPatientAsset(response: APIResponse, forbiddenContent: string[]) {
  if (response.status() >= 400) return;
  const body = await response.text();
  for (const content of forbiddenContent) {
    expect(body).not.toContain(content);
  }
}

async function expectAllowedFunctionOrigin(
  request: APIRequestContext,
  supabaseUrl: URL,
  functionName: string,
  origin: string,
) {
  const originUrl = requireHttpsUrl(origin, functionName);
  const response = await request.fetch(new URL(`/functions/v1/${functionName}`, supabaseUrl).href, {
    method: 'OPTIONS',
    headers: {
      Origin: originUrl.origin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
  });

  expect(response.ok()).toBe(true);
  expect(response.headers()['access-control-allow-origin']).toBe(originUrl.origin);
}
