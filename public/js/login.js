const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const resp = await fetch("http://localhost:3000/login", { method: "POST" });
  if (resp.ok) {
    location.assign("/");
  }
});
