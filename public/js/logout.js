const logoutBtn = document.querySelector(".logoutBtn");
logoutBtn?.addEventListener("click", async (e) => {
  const csurfToken = document.querySelector(".csurfToken").value;
  console.log(csurfToken);
  const resp = await fetch("http://localhost:3000/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csurfToken,
    },
  });
  console.log(resp);
  if (resp.ok) {
    location.assign("/");
  }
});
