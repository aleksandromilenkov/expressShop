const addOrderBtn = document.querySelector(".addOrderBtn");

addOrderBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const csurfToken = document.querySelector(".csurfToken").value;
    const resp = await fetch("http://localhost:3000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csurfToken,
      },
    });
    const data = await resp.json();
    if (data.status === "success") {
      location.assign("/orders");
    } else {
      location.assign("/500");
    }
  } catch (err) {
    console.log(err);
    location.assign("/500");
  }
});
