(() => {
  const usernameInput = document.getElementById('username');
  const [checkCharCount, checkSpace] = [
    document.getElementById('check-char-count-username'),
    document.getElementById('check-space-username'),
  ];

  function checkUsername() {
    const username = document.getElementById('username').value;

    // Character-count check
    if (username.length >= 6) checkCharCount.classList.add('list-ticked');
    else checkCharCount.classList.remove('list-ticked');

    // Space check
    const spaceRegex = /\s/;
    if (spaceRegex.test(username)) checkSpace.classList.remove('list-ticked');
    else checkSpace.classList.add('list-ticked');
  }

  usernameInput.addEventListener('input', checkUsername);
})();

(() => {
  const passwordInput = document.getElementById('password');
  const [
    checkCharCount,
    checkCharType,
    checkLower,
    checkUpper,
    checkDigit,
    checkSpecial,
  ] = [
    document.getElementById('check-char-count'),
    document.getElementById('check-char-type'),
    document.getElementById('check-lower'),
    document.getElementById('check-upper'),
    document.getElementById('check-digit'),
    document.getElementById('check-special'),
  ];

  function checkPassword() {
    const password = document.getElementById('password').value;

    // Character-count check
    if (password.length >= 8) checkCharCount.classList.add('list-ticked');
    else checkCharCount.classList.remove('list-ticked');

    // Character-species check
    const lowerRegex = /[a-z]/;
    const upperRegex = /[A-Z]/;
    const digitRegex = /[0-9]/;
    const specialRegex = /[!@#$%^&*(),.?":{}|<>]/;

    let charSpecies = 0;

    if (lowerRegex.test(password)) {
      checkLower.classList.add('list-ticked');
      charSpecies += 1;
    } else checkLower.classList.remove('list-ticked');

    if (upperRegex.test(password)) {
      checkUpper.classList.add('list-ticked');
      charSpecies += 1;
    } else checkUpper.classList.remove('list-ticked');

    if (digitRegex.test(password)) {
      checkDigit.classList.add('list-ticked');
      charSpecies += 1;
    } else checkDigit.classList.remove('list-ticked');

    if (specialRegex.test(password)) {
      checkSpecial.classList.add('list-ticked');
      charSpecies += 1;
    } else checkSpecial.classList.remove('list-ticked');

    if (charSpecies >= 3) checkCharType.classList.add('list-ticked');
    else checkCharType.classList.remove('list-ticked');
  }

  passwordInput.addEventListener('input', checkPassword);
})();
