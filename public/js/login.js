const loginForm = document.querySelector(".login-form");
const errorField = document.querySelector(".userMessage--error");
console.log(errorField.textContent.length);
if (errorField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let errorM;
  try {
    const csurfToken = document.querySelector(".csurfToken").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    document.querySelector("#email").classList.remove("invalid");
    document.querySelector("#password").classList.remove("invalid");
    const resp = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csurfToken,
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await resp.json();
    errorM = data.message;
    console.log(data);
    console.log(data.status);
    if (data.status === "success") {
      location.assign("/");
      console.log(data.message);
      errorField.classList.add("hide-field");
    } else if (data.status === "error") {
      errorField.classList.remove("hide-field");
      const errorMessage = (document.querySelector(
        ".userMessage--error"
      ).textContent = data.message);
      console.log(data.errors);
      if (data.errors.find((err) => err.path === "email")) {
        document.querySelector("#email").classList.add("invalid");
      }
      if (data.errors.find((err) => err.path === "password")) {
        document.querySelector("#password").classList.add("invalid");
      }
    } else {
      location.assign("/500");
    }
  } catch (err) {
    console.log(err);
    errorField.classList.remove("hide-field");
    document.querySelector(".userMessage--error").textContent = errorM;
  }
});
