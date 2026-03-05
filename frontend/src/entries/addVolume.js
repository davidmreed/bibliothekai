import AddVolume from '../components/AddVolume.svelte';

const target = document.getElementById('lwc');
if (target) {
  new AddVolume({ target });
}
