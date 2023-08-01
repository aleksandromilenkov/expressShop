const deleteBtns = document.querySelectorAll(".deleteProductBtn");
deleteBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const csurfToken = document.querySelector(".csurfToken").value;
    const resp = await fetch(`http://localhost:3000/cart/${btn.dataset.doc}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csurfToken,
      },
    });
    if (resp.ok) {
      location.assign("/cart");
    }
  });
});
