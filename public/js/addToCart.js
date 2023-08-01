const addToCartBtns = document.querySelectorAll(".addToCartBtn");
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const csurfToken = document.querySelector(".csurfToken").value;
    const resp = await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csurfToken,
      },
      body: JSON.stringify({ id: btn.dataset.doc }),
    });
    if (resp.ok) {
      location.assign("/cart");
    }
  });
});
