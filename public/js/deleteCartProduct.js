const deleteBtns = document.querySelectorAll(".deleteProductBtn");
deleteBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await fetch(`http://localhost:3000/cart/${btn.dataset.doc}`, {
      method: "DELETE",
    });
    if (resp.ok) {
      location.assign("/cart");
    }
  });
});
