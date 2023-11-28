(() => {
  const backElms = document.querySelectorAll('.go-back');
  backElms.forEach((elm) => {
    elm.addEventListener('click', () => {
      location.href = '/discover'; // Cannot use referrer, helmet does not allow
    });
  });
})();
