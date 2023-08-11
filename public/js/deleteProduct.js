const deleteBtns = document.querySelectorAll(".deleteProduct");

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", async (e) => {
    const csurfToken = document.querySelector(".csurfToken").value;
    const productElement = deleteBtn.closest("article");
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
    const data = await resp.json();
    if (data.status === "success") {
      productElement.remove();
    } else {
      location.assign("/");
    }
  });
});
