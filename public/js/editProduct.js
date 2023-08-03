const editBtn = document.querySelector(".editProduct");

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
    location.assign("/admin/products");
  } else {
    location.assign("/");
  }
});
