const signupForm = document.querySelector(".signupForm");
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const csurfToken = document.querySelector(".csurfToken").value;
  const email = document.querySelector(".signupEmail").value;
  const password = document.querySelector(".signupPassword").value;
  console.log(email, password);
  const resp = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csurfToken,
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await resp.json();
  console.log(data);
  if (data.status !== "success") {
    location.assign("/signup");
  } else {
    location.assign("/login");
  }
});
