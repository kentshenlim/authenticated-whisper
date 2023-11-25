(() => {
  const pats = document.querySelectorAll('.pat-clicker');
  pats.forEach((pat) => {
    const postID = pat.id; // ID of post has been stored as id of the element
    const fetchURL = `/post/${postID}/pat-toggle`;
    pat.addEventListener('click', async () => {
      try {
        const res = await fetch(fetchURL, { // No need pass user id, available at server side
          method: 'POST',
        });
        const requireSignIn = res.headers.get('Content-Type').includes('text/html');
        if (requireSignIn) {
          window.location.replace(`${window.location.origin}/sign-in`);
        } else { // Pat or un-pat successfully (DB has been updated successfully)
          const data = await res.json(); // {updatedPatCount}
          pat.childNodes[1].textContent = data.updatedPatCount; // The span
          pat.childNodes[1].style.display = data.updatedPatCount ? 'inline' : 'none';
          pat.childNodes[0].src = `/images/${data.pattedNow ? 'heart' : 'heart-outline'}.svg`;
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
})();
