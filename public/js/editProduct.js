const editBtn = document.querySelector(".editProduct");

console.log(window.location.href);
console.log(window.location.href.slice(41, window.location.href.length));
editBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("IN THE CLICK");
  const productId = window.location.href.slice(41, window.location.href.length);
  console.log(e.target.dataset.doc);
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const imageUrl = document.getElementById("imageUrl").value;
  const price = document.getElementById("price").value;

  const resp = await fetch(
    `http://localhost:3000/admin/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, imageUrl, price }),
    }
  );
  console.log(resp);
  if (resp.ok) {
    location.assign("/admin/products");
  }
});
