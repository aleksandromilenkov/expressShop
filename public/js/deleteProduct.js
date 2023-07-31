const deleteBtns = document.querySelectorAll(".deleteProduct");

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", async (e) => {
    const resp = await fetch(
      `http://localhost:3000/admin/products/${e.target.dataset.doc}`,
      {
        method: "DELETE",
      }
    );
    if (resp.ok) {
      location.reload();
    }
  });
});
