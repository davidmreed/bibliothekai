import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

function djangoManifest() {
  return {
    name: 'django-manifest',
    generateBundle(_options, bundle) {
      const manifest = {};

      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk' && file.isEntry) {
          manifest[`${file.name}.js`] = file.fileName;
        }
        if (file.type === 'asset' && file.name && file.name.endsWith('.css')) {
          manifest[file.name] = file.fileName;
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest, null, 2)
      });
    }
  };
}

export default defineConfig({
  base: '/static/',
  plugins: [svelte(), djangoManifest()],
  build: {
    outDir: path.resolve(__dirname, '../backend/translations/static'),
    emptyOutDir: false,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        addVolume: path.resolve(__dirname, 'src/entries/addVolume.js'),
        addPublishedReview: path.resolve(
          __dirname,
          'src/entries/addPublishedReview.js'
        ),
        translationView: path.resolve(
          __dirname,
          'src/entries/translationView.js'
        ),
        compareTranslations: path.resolve(
          __dirname,
          'src/entries/compareTranslations.js'
        )
      }
    }
  }
});
