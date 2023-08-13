const { response } = require("express");

const addProduct = (id) => {
    const cid = "64d2e74c7121e48a5941e943";
    const pid = id;

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: 1 })
    };

    fetch(`/api/remote/carts/${cid}/product/${pid}`, request)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error("Error adding product to cart:", err);
    });

};

const deleteProduct = (id) => {
    const cid = "64d2e74c7121e48a5941e943";
    const pid = id;

    const request = {
        method: "Delete",
        headers: {
            "Content-Type": "application/json"
        },

    };

    fetch(`/api/remote/carts/${cid}/products/${pid}`, request)
    .then((response) => {
      if (response.status === 204) {
        console.log("Product successfully removed");
      } else {
        console.error(
          "Error deleting the product. Status code:",
          response.status
        );
      }
    })
    .catch((err) => {
      console.error("Error deleting product:", err);
    });
} 

