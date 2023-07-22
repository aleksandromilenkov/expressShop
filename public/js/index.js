const addProductForm = document.querySelector(".product-form");
console.log("QWE");
const createProduct = async (data) => {
  console.log(data);
  const product = await fetch("http://localhost:3000/admin/add-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resp = await product.json();
  return resp;
};
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("asd");
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const price = document.getElementById("price").value;
  const response = await createProduct({ title, description, imageUrl, price });
  console.log(response);
  if (response.status === "success") {
    location.assign("/");
  }
});
