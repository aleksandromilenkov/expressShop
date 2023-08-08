const editBtn = document.querySelector(".editProduct");
const errorField = document.querySelector(".userMessage--error");

if (errorField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}

editBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const form = new FormData();
  const productId = window.location.href.slice(41, window.location.href.length);
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];
  const price = document.getElementById("price").value;
  const csurfToken = document.querySelector(".csurfToken").value;
  form.append("title", title);
  form.append("description", description);
  form.append("image", image);
  form.append("price", price);

  const resp = await fetch(
    `http://localhost:3000/admin/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "X-CSRF-Token": csurfToken,
      },
      body: form,
    }
  );
  console.log(resp);
  const data = await resp.json();
  console.log(data);
  if (data.status === "success") {
    errorField.classList.add("hide-field");
    errorField.textContent = "";
    document.querySelector("#image").classList.remove("invalid");
    location.assign("/admin/products");
  } else if (data.status === "error") {
    errorField.classList.remove("hide-field");
    errorField.textContent = data.message;
    if (data.errors.find((er) => er.path === "image")) {
      document.querySelector("#image").classList.add("invalid");
    }
    if (data.errors.find((er) => er.path === "price")) {
      document.querySelector("#price").classList.add("invalid");
    }
    if (data.errors.find((er) => er.path === "title")) {
      document.querySelector("#title").classList.add("invalid");
    }
  } else {
    location.assign("/500");
  }
});
