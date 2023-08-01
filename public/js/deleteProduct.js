const deleteBtns = document.querySelectorAll(".deleteProduct");

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", async (e) => {
    const csurfToken = document.querySelector(".csurfToken").value;
    const resp = await fetch(
      `http://localhost:3000/admin/products/${e.target.dataset.doc}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csurfToken,
        },
      }
    );
    if (resp.ok) {
      location.reload();
    }
  });
});
