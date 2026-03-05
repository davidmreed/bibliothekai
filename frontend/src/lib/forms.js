function markInvalid(form) {
  if (!form) {
    return true;
  }
  const status = form.checkValidity();

  if (!status) {
    form.querySelectorAll(':invalid').forEach((elem) => {
      elem.classList.add('is-invalid');
      elem.addEventListener(
        'input',
        () => elem.classList.remove('is-invalid'),
        { once: true }
      );
      elem.addEventListener(
        'change',
        () => elem.classList.remove('is-invalid'),
        { once: true }
      );
    });
  }

  return status;
}

function formatError(error) {
  if (!error) {
    return '';
  }
  if (typeof error === 'string') {
    return error;
  }
  return error.message || String(error);
}

export { markInvalid, formatError };
