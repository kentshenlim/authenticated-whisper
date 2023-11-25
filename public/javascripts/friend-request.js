(() => {
  const btn = document.querySelector('.friend-request');
  const anotherUserID = btn.id; // Stored as ID of this element

  const map = {
    request: 'request-friend',
    accept: 'accept-friend',
    remove: 'remove-friend',
    cancel: 'cancel-friend-request',
  }; // data-friendRequestType => post endpoint suffix, see user router
  const fetchURL = `/user/${anotherUserID}/${map[btn.dataset.friendRequestType]}`;

  btn.addEventListener('click', async () => {
    try {
      const res = await fetch(fetchURL, {
        method: 'POST',
      });
      // Server will send html (redirect) if authentication required
      // Otherwise will send json
      const requireSignIn = res.headers.get('Content-Type').includes('text/html');
      if (requireSignIn) {
        window.location.replace(`${window.location.origin}/sign-in`);
      } else {
        window.location.replace(`${window.location.origin}/user/${anotherUserID}`); // Refresh without extra history entry
      }
    } catch (err) {
      console.error(err);
    }
  });
})();
