const deleteBtns = document.querySelectorAll(".deleteProductBtn");
deleteBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const csurfToken = document.querySelector(".csurfToken").value;
      const resp = await fetch(
        `http://localhost:3000/cart/${btn.dataset.doc}`,
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
        location.assign("/cart");
      }
    } catch (err) {
      console.log(err);
      location.assign("/500");
    }
  });
});
