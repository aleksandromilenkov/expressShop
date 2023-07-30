const addOrderBtn = document.querySelector(".addOrderBtn");

addOrderBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const resp = await fetch("http://localhost:3000/create-order", {
    method: "POST",
  });
  if (resp.ok) {
    location.assign("/orders");
  }
});
