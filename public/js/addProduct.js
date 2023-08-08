const addProductForm = document.querySelector(".product-form");
const errorField = document.querySelector(".userMessage--error");
if (errorField.textContent.length !== 0) {
  errorField.classList.remove("hide-field");
}
const createProduct = async (data) => {
  const csurfToken = document.querySelector(".csurfToken").value;
  const product = await fetch("http://localhost:3000/admin/add-product", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csurfToken,
    },
    body: data,
  });
  const resp = await product.json();
  return resp;
};
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];
  const price = document.getElementById("price").value;
  form.append("title", title);
  form.append("description", description);
  form.append("image", image);
  form.append("price", price);
  console.log(form);
  try {
    const response = await createProduct(form);
    console.log(response);
    if (response.status === "success") {
      errorField.classList.add("hide-field");
      errorField.textContent = "";
      location.assign("/");
    } else if (response.status === "error") {
      errorField.classList.remove("hide-field");
      errorField.textContent = response.message;
      if (response.errors.find((er) => er.path === "title")) {
        document.querySelector("#title").classList.add("invalid");
      }
      if (response.errors.find((er) => er.path === "image")) {
        document.querySelector("#image").classList.add("invalid");
      }
      if (response.errors.find((er) => er.path === "price")) {
        document.querySelector("#price").classList.add("invalid");
      }
    } else {
      console.log("E");
      // location.assign("/500");
    }
  } catch (err) {
    location.assign("/500");
    console.log(err);
    return;
  }
});
