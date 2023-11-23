(() => {
  const [binBtn, cancelBtn, deleteSection, overlaySection] = [
    document.getElementById('trigger-popup-btn'),
    document.getElementById('cancel-btn'),
    document.getElementById('delete-section'),
    document.getElementById('overlay-section'),
  ];

  binBtn.addEventListener('click', () => {
    deleteSection.style.display = 'block';
    overlaySection.style.display = 'block';
  });

  cancelBtn.addEventListener('click', () => {
    deleteSection.style.display = 'none';
    overlaySection.style.display = 'none';
  });
})();
