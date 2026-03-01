import TranslationView from '../components/TranslationView.svelte';

const target = document.getElementById('lwc');
if (target) {
  new TranslationView({ target });
}
