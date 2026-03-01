import AddPublishedReview from '../components/AddPublishedReview.svelte';

const target = document.getElementById('lwc');
if (target) {
  new AddPublishedReview({ target });
}
