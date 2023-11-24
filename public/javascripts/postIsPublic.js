(() => {
  const btn = document.getElementById('togglePostPublic');
  const lockedNotImg = btn.firstElementChild;
  const lockedImg = btn.lastElementChild;
  const postID = btn.dataset.postId;
  const fetchURL = `/post/${postID}/toggle-is-public`;

  btn.addEventListener('click', async () => {
    const res = await fetch(fetchURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) window.location.replace(`${window.location.origin}/sign-in`);
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
  });
})();
