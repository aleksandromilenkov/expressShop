const addToCartBtns = document.querySelectorAll(".addToCartBtn");
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const resp = await fetch("http://localhost:3000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: btn.dataset.doc }),
    });
    if (resp.ok) {
      location.assign("/cart");
    }
  });
});
