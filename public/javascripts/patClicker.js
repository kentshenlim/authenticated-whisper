(() => {
  const pats = document.querySelectorAll('.pat-clicker');
  pats.forEach((pat) => {
    const postID = pat.id; // ID of post has been stored as id of the element
    const fetchURL = `/post/${postID}/pat-toggle`;
    pat.addEventListener('click', async () => {
      const res = await fetch(fetchURL, { // No need pass user id, available at server side
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) { // Pat or un-pat successfully (DB has been updated successfully)
        const data = await res.json(); // {updatedPatCount}
        console.log(data);
        pat.childNodes[1].textContent = data.updatedPatCount; // The span
      }
    });
  });
})();
