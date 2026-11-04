import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Node'un uzantısız TypeScript içe aktarımlarını çözmesi için küçük bir yükleyici. */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && !/\.[a-zA-Z0-9]+$/.test(specifier)) {
    for (const suffix of ['.ts', '/index.ts']) {
      try {
        const candidate = await nextResolve(`${specifier}${suffix}`, context);
        if (existsSync(fileURLToPath(candidate.url))) return candidate;
      } catch {
        // Aşağıdaki normal çözümlemeye devam et.
      }
    }
  }
  return nextResolve(specifier, context);
}
