export type StimulusAssetKind = 'image' | 'audio' | 'pdf';

export interface StimulusManifestEntry {
  taskType: string;
  assetId: string;
  label: string;
  kind: StimulusAssetKind;
  contentType: string;
  required: boolean;
  storagePath: string;
}

const SUPPORTED_MOCA_VERSIONS = ['8.1', '8.2', '8.3'] as const;

type SupportedMocaVersion = (typeof SUPPORTED_MOCA_VERSIONS)[number];

const TASK_ASSETS: Array<Omit<StimulusManifestEntry, 'storagePath'>> = [
  {
    taskType: 'moca-visuospatial',
    assetId: 'trail-template',
    label: 'Trail Making visual template',
    kind: 'image',
    contentType: 'image/png',
    required: true,
  },
  {
    taskType: 'moca-cube',
    assetId: 'cube-stimulus',
    label: 'Cube copy stimulus',
    kind: 'image',
    contentType: 'image/png',
    required: true,
  },
  {
    taskType: 'moca-naming',
    assetId: 'item-1',
    label: 'Naming item 1',
    kind: 'image',
    contentType: 'image/png',
    required: true,
  },
  {
    taskType: 'moca-naming',
    assetId: 'item-2',
    label: 'Naming item 2',
    kind: 'image',
    contentType: 'image/png',
    required: true,
  },
  {
    taskType: 'moca-naming',
    assetId: 'item-3',
    label: 'Naming item 3',
    kind: 'image',
    contentType: 'image/png',
    required: true,
  },
  {
    taskType: 'moca-memory-learning',
    assetId: 'word-list-audio',
    label: 'Memory learning audio prompt',
    kind: 'audio',
    contentType: 'audio/mpeg',
    required: true,
  },
];

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  'image/png': 'png',
  'audio/mpeg': 'mp3',
  'application/pdf': 'pdf',
};

export function supportedMocaVersions(): string[] {
  return [...SUPPORTED_MOCA_VERSIONS];
}

export function isSupportedMocaVersion(version: string): version is SupportedMocaVersion {
  return SUPPORTED_MOCA_VERSIONS.includes(version as SupportedMocaVersion);
}

export function buildStimulusManifest(mocaVersion: string): StimulusManifestEntry[] {
  if (!isSupportedMocaVersion(mocaVersion)) {
    throw new Error(`Unsupported MoCA version: ${mocaVersion}`);
  }

  return TASK_ASSETS.map((asset) => ({
    ...asset,
    storagePath: `${mocaVersion}/${asset.taskType}/${asset.assetId}.${extensionFor(asset.contentType)}`,
  }));
}

function extensionFor(contentType: string): string {
  const extension = EXTENSION_BY_CONTENT_TYPE[contentType];
  if (!extension) throw new Error(`Unsupported stimulus content type: ${contentType}`);
  return extension;
}
