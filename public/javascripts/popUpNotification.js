(() => {
  const notifications = document.querySelectorAll('.pop-up-notification');
  notifications.forEach((node) => {
    const ref = node;
    ref.style.opacity = 0;
  });
})();
