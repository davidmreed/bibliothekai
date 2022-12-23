function getCookie(name) {
  // From Django documentation

  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
function getEndpoint() {
  // eslint-disable-next-line no-undef
  return 'http://localhost:9120';
}
function getApiEndpoint() {
  return `${getEndpoint()}/api`;
}
export { getCookie, getEndpoint, getApiEndpoint };