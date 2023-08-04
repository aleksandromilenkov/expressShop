const signupForm = document.querySelector(".signupForm");
const errorField = document.querySelector(".userMessage--error");
const registeredField = document.querySelector(".userMessage--registered");
console.log(errorField.textContent.length);
if (errorField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}
console.log(registeredField.textContent.length);
if (registeredField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const csurfToken = document.querySelector(".csurfToken").value;
  const email = document.querySelector(".signupEmail").value;
  const password = document.querySelector(".signupPassword").value;
  const confirmPassword = document.querySelector(
    ".signupConfirmPassword"
  ).value;
  document.querySelector(".signupEmail").classList.remove("invalid");
  document.querySelector(".signupPassword").classList.remove("invalid");
  document.querySelector(".signupConfirmPassword").classList.remove("invalid");
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
      confirmPassword,
    }),
  });
  const data = await resp.json();
  console.log(data);
  if (data.status !== "success") {
    errorField.classList.remove("hide-field");
    registeredField.classList.add("hide-field");
    errorField.textContent = data.message;
    console.log(data.errors);
    if (data.errors.find((er) => er.path === "email")) {
      console.log("s");
      document.querySelector(".signupEmail").classList.add("invalid");
    }
    if (data.errors.find((er) => er.path === "password")) {
      document.querySelector(".signupPassword").classList.add("invalid");
    }
    if (data.errors.find((er) => er.path === "confirmPassword")) {
      document.querySelector(".signupConfirmPassword").classList.add("invalid");
    }
  } else {
    errorField.classList.add("hide-field");
    registeredField.classList.remove("hide-field");
    console.log(registeredField.classList);
    registeredField.innerHTML = `
    Registered Successfully, An E-mail was sent to you for registration.<a href=${data.sentEmail.preview}> See the e-mail here.</a> <div> <a href='http://localhost:3000/login'>Log in now </a>`;
    // location.assign("/login");
  }
});
