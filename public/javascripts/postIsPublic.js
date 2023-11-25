(() => {
  const btn = document.getElementById('togglePostPublic');
  const lockedNotImg = btn.firstElementChild;
  const lockedImg = btn.lastElementChild;
  const postID = btn.dataset.postId;
  const fetchURL = `/post/${postID}/toggle-is-public`;

  btn.addEventListener('click', async () => {
    try {
      const res = await fetch(fetchURL, {
        method: 'POST',
      });
      const requireSignIn = res.headers.get('Content-Type').includes('text/html');
      if (requireSignIn) window.location.replace(`${window.location.origin}/sign-in`);
      else {
        const data = await res.json();
        if (data.isNowPublic) {
          lockedImg.style.display = 'none';
          lockedNotImg.style.display = 'block';
        } else {
          lockedImg.style.display = 'block';
          lockedNotImg.style.display = 'none';
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
})();
