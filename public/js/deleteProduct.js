const deleteBtns = document.querySelectorAll(".deleteProduct");

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", async (e) => {
    console.log("IN THE CLICK");
    console.log(e.target.dataset.doc);
    const resp = await fetch(
      `http://localhost:3000/admin/products/${e.target.dataset.doc}`,
      {
        method: "DELETE",
      }
    );
    console.log(resp);
    if (resp.ok) {
      location.reload();
    }
  });
});
