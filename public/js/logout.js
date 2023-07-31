const logoutBtn = document.querySelector(".logoutBtn");

logoutBtn.addEventListener("click", async (e) => {
  const resp = await fetch("http://localhost:3000/logout", { method: "POST" });
  if (resp.ok) {
    location.assign("/");
  }
});
