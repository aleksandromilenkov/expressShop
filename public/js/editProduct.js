const editBtn = document.querySelector(".editProduct");
const errorField = document.querySelector(".userMessage--error");

if (errorField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}

editBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const productId = window.location.href.slice(41, window.location.href.length);
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const price = document.getElementById("price").value;
  const csurfToken = document.querySelector(".csurfToken").value;

  const resp = await fetch(
    `http://localhost:3000/admin/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csurfToken,
      },
      body: JSON.stringify({ title, description, imageUrl, price }),
    }
  );
  console.log(resp);
  const data = await resp.json();
  console.log(data);
  if (data.status === "success") {
    errorField.classList.add("hide-field");
    errorField.textContent = "";
    document.querySelector("#imageUrl").classList.remove("invalid");
    location.assign("/admin/products");
  } else if (data.status === "error") {
    errorField.classList.remove("hide-field");
    errorField.textContent = data.message;
    if (data.errors.find((er) => er.path === "imageUrl")) {
      document.querySelector("#imageUrl").classList.add("invalid");
    }
    if (data.errors.find((er) => er.path === "price")) {
      document.querySelector("#price").classList.add("invalid");
    }
    if (data.errors.find((er) => er.path === "title")) {
      document.querySelector("#title").classList.add("invalid");
    }
  }
});
