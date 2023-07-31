const editBtn = document.querySelector(".editProduct");

editBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const productId = window.location.href.slice(41, window.location.href.length);
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
  if (resp.ok) {
    location.assign("/admin/products");
  }
});
