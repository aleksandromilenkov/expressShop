const addProductForm = document.querySelector(".product-form");
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
  const response = await createProduct({ title, description, imageUrl, price });
  if (response.status === "success") {
    location.assign("/");
  }
});
