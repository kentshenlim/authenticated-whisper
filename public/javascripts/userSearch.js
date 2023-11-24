(() => {
  const btn = document.getElementById('search-user');
  const failureText = document.getElementById('failure-text');
  const userFound = document.getElementById('user-found');
  const userAnchor = document.getElementById('user-anchor');
  const userDP = document.getElementById('user-dp');
  const userDisplayName = document.getElementById('user-display-name');

  btn.addEventListener('click', async (e) => {
    e.preventDefault(); // Do not send the form to server
    const username = document.getElementById('username').value;
    const fetchURL = `/discover/user-search/${username}`;
    const res = await fetch(fetchURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) { // Ask to sign in again
      window.location.replace(`${window.location.origin}/sign-in`);
    } else {
      const data = await res.json();
      // If data failureText is truthy, search is futile
      if (data.failureText) {
        failureText.textContent = data.failureText;
        userFound.style.display = 'none';
      } else { // Successful query
        failureText.textContent = '';
        userFound.style.display = 'block';
        userDisplayName.textContent = data.displayName;
        userDP.src = data.dp;
        userAnchor.href = data.url;
      }
    }
  });
})();
