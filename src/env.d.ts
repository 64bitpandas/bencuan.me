/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_COMMIT_SHA: string;
  readonly PUBLIC_COMMIT_DATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
