// Reset height for mobile browser
// Source: https://stackoverflow.com/a/43575432
(() => {
  function resetHeight() {
    document.body.style.height = `${window.innerHeight}px`;
  }
  window.addEventListener('resize', resetHeight);
  resetHeight();
})();
