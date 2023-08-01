const addOrderBtn = document.querySelector(".addOrderBtn");

addOrderBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const csurfToken = document.querySelector(".csurfToken").value;
  const resp = await fetch("http://localhost:3000/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csurfToken,
    },
  });
  if (resp.ok) {
    location.assign("/orders");
  }
});
