const resetPasswordBtn = document.querySelector(".resetPasswordBtn");
const errorField = document.querySelector(".userMessage--error");
const resetPasswordSuccessField = document.querySelector(".userMessage--reset");
if (errorField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}
if (resetPasswordSuccessField.textContent.length !== 0) {
  resetPasswordSuccessField.classList.remove("hide-field");
}
resetPasswordBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const csurfToken = document.querySelector(".csurfToken").value;
  const email = document.querySelector("#email").value;
  const resp = await fetch("http://localhost:3000/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csurfToken,
    },
    body: JSON.stringify({ email }),
  });
  const data = await resp.json();
  if (data.status === "error") {
    resetPasswordSuccessField.classList.add("hide-field");
    errorField.classList.remove("hide-field");
    errorField.textContent = data.message;
    console.log(data.message);
  } else if (data.status === "success") {
    errorField.classList.add("hide-field");
    resetPasswordSuccessField.classList.remove("hide-field");
    resetPasswordSuccessField.innerHTML = `
    Password reset link sent to e-mail. Click here to open it: <a href=${data.sentEmail.preview}> Open e-mail</a>`;
  } else {
    location.assign("/500");
  }
});
