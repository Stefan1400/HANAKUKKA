const searchIcon = document.querySelector('#searchIcon');
const searchPage = document.querySelector('#searchPage');

const menuIcon = document.querySelector('#menuIcon');
const menuPage = document.querySelector('#menuPage');

const cartIcon = document.querySelector('#cartIcon');
const cartPage = document.querySelector('#cartPage');

const newCreationsLinkHome = document.querySelector("#new-creations-link-home");
const newCreationsLinkMenu = document.querySelector("#new-creations-link-menu");
const newCreationsPage = document.querySelector('#new-creations-page');

const logo = document.querySelector('#logo');

const productDisplayPage = document.querySelector('#productPage');
const productImage = productDisplayPage.querySelector('img');
const productName = productDisplayPage.querySelector('h3');
const productPrice = productDisplayPage.querySelector('.price');
const goBack = document.querySelectorAll('.back');
let addToCart = document.querySelector('.add-to-cart');

const rcDiv = document.querySelector('.rc-main-div');
const rcClose = document.querySelector('.rc-close');
const rcCancel = document.querySelector('.rc-cancel');
let rcRemove = document.querySelector('.rc-remove');

const cartEmptyDiv = document.querySelector('.cart-empty-div');

cartPage.appendChild(cartEmptyDiv);


// INITIALLY DISPLAYING ALL CART ITEMS
const fetchCartData = async () => {
   try {
     const response = await fetch("http://localhost:5000/api/userCart/GetAllProducts");
     if (!response.ok) {
       throw new Error("Failed to fetch cart data");
     }
 
     const data = await response.json();
     console.log("Cart Data:", data);

     const cartItems = cartPage.querySelectorAll('.cart-item');
     cartItems.forEach(item => item.remove());

      if (data && data.length > 0) {
         data.forEach(item => {
            createCartItem(item.id, item.name, item.price, item.url);
         })
         if (cartPage.contains(cartEmptyDiv)) {
            cartPage.removeChild(cartEmptyDiv);
         }

      } else if (data.length === 0) {
         if (!cartPage.contains(cartEmptyDiv)) {
            cartPage.appendChild(cartEmptyDiv);
         }
      }
   } catch (error) {
     console.error("Error:", error.message);
   }
};
window.onload = fetchCartData;

const displayAllProducts = async () => {
   
   try {
     const response = await fetch("http://localhost:5000/api/productData");
     if (!response.ok) {
       throw new Error("Failed to fetch cart data");
     }
 
     const data = await response.json();

     data.forEach(item => {
         const productImage = document.createElement('img');
         productImage.classList.add('products');
         productImage.src = item.url;
         productImage.dataset.price = item.price;
         productImage.id = item.name;

         const ncImageFlex = document.querySelector('#nc-img-flex');

         ncImageFlex.appendChild(productImage);

         productImage.addEventListener('click', () => {
            productDisplayPage.classList.add('visible');
            const productName = productImage.id;
            const productUrl = productImage.src;
            const productPrice = productImage.dataset.price;
            displayProductData(productName, productUrl, productPrice);
         })
      })
      
   } catch (error) {
     console.error("Error:", error.message);
   }
};
window.onload = displayAllProducts;

// DISPLAY RECENTLY ADDED TO CART PRODUCT

const displayRecentlyAddedProduct = async () => {
   try {
     const response = await fetch("http://localhost:5000/api/userCart/GetAddedItem");
     if (!response.ok) {
       throw new Error("Failed to fetch cart data");
     }
 
     const data = await response.json();
     console.log("Cart Data:", data);

   if (data.length === 0) {
      cartEmptyDiv.classList.add('visible');
   } else {
      cartEmptyDiv.classList.remove('visible');
   }


   createCartItem(data.id, data.name, data.price, data.url);

   fetchCartData();

   } catch (error) {
     console.error("Error:", error.message);
   }
};

// CREATE CART ITEM 
const createCartItem = (id, name, price, url) => {
   // console.log(id, name, price, url);

   const cartItem = document.createElement('div');
   cartItem.classList.add('cart-item');

   const cartNumber = document.createElement('p');
   cartNumber.classList.add('cart-number');

   const cartImage = document.createElement('img');
   cartImage.classList.add('cart-image');

   const cartName = document.createElement('h3');
   cartName.classList.add('cart-name');

   const cartPrice = document.createElement('p');
   cartPrice.classList.add('cart-price');

   const cartRemove = document.createElement('p');
   cartRemove.classList.add('cart-remove');

   cartItem.appendChild(cartNumber);
   cartItem.appendChild(cartImage);
   cartItem.appendChild(cartName);
   cartItem.appendChild(cartPrice);
   cartItem.appendChild(cartRemove);
   
   const clonedCartItem = cartItem.cloneNode(true);
   clonedCartItem.querySelector('.cart-image').src = url;
   clonedCartItem.querySelector('.cart-name').textContent = name;
   clonedCartItem.querySelector('.cart-price').textContent = `$${price}.00`;
   clonedCartItem.querySelector('.cart-number').textContent = '1/1';
   clonedCartItem.querySelector('.cart-remove').textContent = 'REMOVE FROM CART';
   clonedCartItem.classList.add('flex');
   cartPage.appendChild(clonedCartItem);

   const removeButton = clonedCartItem.querySelector('.cart-remove');

   removeButton.addEventListener('click', () => {
      rcDiv.classList.add('visible');
      console.log('clicked...');
   })

   console.log('Here is the id:', id);

   rcRemove.replaceWith(rcRemove.cloneNode(true));
   rcRemove = document.querySelector('.rc-remove');

   rcRemove.addEventListener('click', async () => {
      console.log("Delete clicked for ID:", id);
      try {
         const response = await fetch(`http://localhost:5000/api/userCart/${id}`, {
            method: 'DELETE',
         });

         if (!response.ok) {
            throw new Error('Failed to delete item');
         }

         fetchCartData();
         clonedCartItem.remove();
         rcDiv.classList.remove('visible');
         console.log(`Item with ID ${id} has been deleted from the cart.`);
      } catch(err) {
         console.error('Error:', err.message);
      }
   });
}

// DYNAMICALLY GENERATING PRODUCT PAGE
const displayProductData = (name, url, price, id) => {
   
   const checkIfItemInCart = async (name) => {
      try {
         const response = await fetch(`http://localhost:5000/api/userCart/checkExist?name=${name}`);

         if (!response.ok) {
            throw new Error('existence check failed');
         }

         const data = await response.json();

         if (data.exists) {
            addToCart.textContent = 'ADDED TO CART';
            addToCart.classList.add('added');
            addToCart.disabled = true;
         } else {
            addToCart.textContent = 'ADD TO CART';
            addToCart.classList.remove('added');
            addToCart.disabled = false;
         }

         // console.log('Exist check successful:', data);

      } catch (err) {
         console.error('Error with checking existence:', err);
      }
   }

   checkIfItemInCart(name);
   
   productName.textContent = name;
   productImage.src = url;
   productPrice.textContent = `$${price}.00`;

   let newAddToCart = addToCart.cloneNode(true);
   addToCart.replaceWith(newAddToCart);
   addToCart = newAddToCart;

   addToCart.addEventListener('click', async () => {
      if (addToCart.disabled) return;
      
      console.log('button clicked...');

      addToCart.textContent = 'ADDING...';
      addToCart.disabled = true;
      
      try {
         const response = await fetch('http://localhost:5000/api/userCart', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({name: name, price: price, url: url})
         });
   
         if (!response.ok) {
            throw new Error('problem with response');
         }
         
         displayRecentlyAddedProduct();
         addToCart.textContent = 'ADDED TO CART';
         addToCart.classList.add('added');
         console.log('product added to cart');
      } catch (err) {
         console.error('error with post request:', err);
         addToCart.textContent = 'ADD TO CART';
         addToCart.classList.remove('added');
         addToCart.disabled = false;
      }
   });
}




// NON API FUNCTIONS

[rcClose, rcCancel].forEach(btn => {
   btn.addEventListener('click', () => {
      console.log('close or cancel clicked');
      rcDiv.classList.remove('visible');
   })
})

goBack.forEach(back => {
   back.addEventListener('click', () => {
      const pageToClose = back.parentElement;
      
      pageToClose.classList.remove('visible');
   })
})

searchIcon.addEventListener('click', () => {
   searchPage.classList.toggle('visible');
});

menuIcon.addEventListener('click', () => {
   menuPage.classList.toggle('visible');
});

cartIcon.addEventListener('click', () => {
   cartPage.classList.toggle('visible');
});

newCreationsLinkHome.addEventListener('click', () => {
   newCreationsPage.classList.add('visible');
});

newCreationsLinkMenu.addEventListener('click', () => {
   newCreationsPage.classList.add('visible');
   menuPage.classList.remove('visible');
   if (productDisplayPage.classList.contains('visible')) {
      productDisplayPage.classList.remove('visible');
   }
});

logo.addEventListener('click', () => {
   if (searchPage.classList.contains('visible')) {
      searchPage.classList.toggle('visible');
   }
   if (menuPage.classList.contains('visible')) {
      menuPage.classList.toggle('visible');
   }
   if (cartPage.classList.contains('visible')) {
      cartPage.classList.toggle('visible');
   }
   if (newCreationsPage.classList.contains('visible')) {
      newCreationsPage.classList.toggle('visible');
   }
   if (productDisplayPage.classList.contains('visible')) {
      productDisplayPage.classList.toggle('visible');
   }
});