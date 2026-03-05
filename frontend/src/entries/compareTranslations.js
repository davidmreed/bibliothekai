import CompareTranslations from '../components/CompareTranslations.svelte';

const target = document.getElementById('lwc');
if (target) {
  new CompareTranslations({ target });
}
