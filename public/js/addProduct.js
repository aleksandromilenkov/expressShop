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
      "Content-Type": "application/json",
      "X-CSRF-Token": csurfToken,
    },
    body: JSON.stringify(data),
  });
  const resp = await product.json();
  return resp;
};
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const price = document.getElementById("price").value;
  try {
    const response = await createProduct({
      title,
      description,
      imageUrl,
      price,
    });
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
      if (response.errors.find((er) => er.path === "imageUrl")) {
        document.querySelector("#imageUrl").classList.add("invalid");
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
