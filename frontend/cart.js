document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCountElement = document.getElementById('cart-count');
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const token = localStorage.getItem('token');

  if (token) {
    loginLink.style.display = 'none';
    logoutLink.style.display = 'block';
  }

  logoutLink.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });

  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        window.location.href = '/login.html';
        return;
      }

      const cart = await res.json();
      renderCart(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const renderCart = (cart) => {
    cartItemsContainer.innerHTML = '';
    if (!cart.orderItems || cart.orderItems.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      cartTotalElement.textContent = '0.00';
      cartCountElement.textContent = '0';
      return;
    }

    cart.orderItems.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <input type="number" value="${item.qty}" min="1" data-id="${item.product}">
          <button data-id="${item.product}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = cart.totalPrice.toFixed(2);
    cartCountElement.textContent = cart.orderItems.reduce((acc, item) => acc + item.qty, 0);

    // Add event listeners for remove buttons
    document.querySelectorAll('.cart-item-actions button').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        removeCartItem(productId);
      });
    });

    // Add event listeners for quantity inputs
    document.querySelectorAll('.cart-item-actions input').forEach(input => {
      input.addEventListener('change', (e) => {
        const productId = e.target.getAttribute('data-id');
        const qty = parseInt(e.target.value);
        updateCartItem(productId, qty);
      });
    });
  };

  const updateCartItem = async (productId, qty) => {
    try {
      await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, qty }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeCartItem = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  if (token) {
    fetchCart();
  }
}); 