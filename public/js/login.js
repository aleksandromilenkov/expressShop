const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const csurfToken = document.querySelector(".csurfToken").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  console.log(password);
  const resp = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csurfToken,
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await resp.json();
  if (data.status === "success") {
    location.assign("/");
    console.log(data.message);
  } else {
    console.log(data.message);
  }
});
