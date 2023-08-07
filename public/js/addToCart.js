const addToCartBtns = document.querySelectorAll(".addToCartBtn");
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    try {
      const csurfToken = document.querySelector(".csurfToken").value;
      const resp = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csurfToken,
        },
        body: JSON.stringify({ id: btn.dataset.doc }),
      });
      const data = await resp.json();
      if (data.status === "success") {
        location.assign("/cart");
      } else {
        console.log(err);
        location.assign("/500");
      }
    } catch (err) {
      console.log(err);
      location.assign("/500");
    }
  });
});
