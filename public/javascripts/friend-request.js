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
    const res = await fetch(fetchURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      window.location.replace(`${window.location.origin}/user/${anotherUserID}`); // Refresh without extra history entry
    } else {
      window.location.replace(`${window.location.origin}/sign-in`);
    }
  });
})();
