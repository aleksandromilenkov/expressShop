const signupForm = document.querySelector(".signupForm");
const errorField = document.querySelector(".userMessage--error");
console.log(errorField.textContent.length);
if (errorField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}
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
    errorField.classList.remove("hide-field");
    errorField.textContent = data.message;
  } else {
    errorField.classList.add("hide-field");
    location.assign("/login");
  }
});
