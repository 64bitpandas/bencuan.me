export const VERSIONS = ['v1', 'v2'] as const;
export type TurtleNetVersion = (typeof VERSIONS)[number];

/** The version that lives at the top-level /turtlenet/* URLs. */
export const LATEST_VERSION: TurtleNetVersion = 'v2';

export interface TurtleNetVersionMeta {
  id: TurtleNetVersion;
  label: string;
  date: string;
  primaryColor: string;
}

export const VERSION_META: Record<TurtleNetVersion, TurtleNetVersionMeta> = {
  v1: { id: 'v1', label: 'v1', date: 'may 2023', primaryColor: '#A90E3C' },
  v2: { id: 'v2', label: 'v2', date: 'may 2026', primaryColor: '#203c7f' },
};

export function getVersionMeta(v: TurtleNetVersion): TurtleNetVersionMeta {
  return VERSION_META[v];
}

export function getPrimaryColor(v: TurtleNetVersion): string {
  return VERSION_META[v].primaryColor;
}

export function isLatest(v: TurtleNetVersion): boolean {
  return v === LATEST_VERSION;
}

/** URL prefix segment after `/turtlenet`. Latest has no prefix; others get `/{version}`. */
export function versionPathPrefix(v: TurtleNetVersion): string {
  return isLatest(v) ? '' : `/${v}`;
}

/** Base URL for a version (e.g. `/turtlenet` for latest, `/turtlenet/v1` otherwise). */
export function versionBaseUrl(v: TurtleNetVersion): string {
  return `/turtlenet${versionPathPrefix(v)}`;
}

/** URL for a specific page in a version. order=0 maps to the base URL. */
export function pageUrl(v: TurtleNetVersion, order: number, pageSlug: string): string {
  const base = versionBaseUrl(v);
  return order === 0 ? base : `${base}/${pageSlug}`;
}

/** URL for the single-page edition of a version. */
export function allUrl(v: TurtleNetVersion): string {
  return `${versionBaseUrl(v)}/all`;
}

/** Derive the version from a content entry id like `v1/0-welcome-to-turtlenet.md`. */
export function versionFromEntryId(id: string): TurtleNetVersion {
  const prefix = id.split('/')[0];
  if ((VERSIONS as readonly string[]).includes(prefix)) {
    return prefix as TurtleNetVersion;
  }
  throw new Error(`Cannot derive TurtleNet version from entry id: ${id}`);
}
