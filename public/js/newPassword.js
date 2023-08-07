const updatePasswordBtn = document.querySelector(".updatePasswordBtn");
const updatePasswordSuccessField = document.querySelector(
  ".userMessage--reset"
);
const passwordsDontMatchField = document.querySelector(
  ".userMessage--passwordsDontMatch"
);

if (passwordsDontMatchField.textContent.length !== 0) {
  passwordsDontMatchField.classList.remove("hide-field");
}

if (updatePasswordSuccessField.textContent.length !== 0) {
  passwordsDontMatchField.classList.remove("hide-field");
}

updatePasswordBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const newPassword = document.querySelector(".newPassword").value;
  const newPasswordConfirm = document.querySelector(
    ".newPasswordConfirm"
  ).value;
  const token = document.querySelector(".token").value;
  const csurfToken = document.querySelector(".csurfToken").value;
  const userId = document.querySelector(".userId").value;

  if (newPassword !== newPasswordConfirm) {
    passwordsDontMatchField.textContent =
      "Passwords are not the same. Try again";
    passwordsDontMatchField.classList.remove("hide-field");
    return;
  }
  const resp = await fetch(`http://localhost:3000/reset/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csurfToken,
    },
    body: JSON.stringify({ newPassword, userId, token }),
  });
  const data = await resp.json();
  if (data.status === "error") {
    passwordsDontMatchField.textContent = data.message;
    passwordsDontMatchField.classList.remove("hide-field");
  } else if (data.status === "success") {
    updatePasswordSuccessField.classList.remove("hide-field");
    updatePasswordSuccessField.innerHTML = `
    Password successfully updated. <a href="http://localhost:3000/login">Log in here </a>`;
  } else {
    location.assign("/500");
  }
});
