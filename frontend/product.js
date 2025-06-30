document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const addToCartButton = document.getElementById('add-to-cart-btn');
    const token = localStorage.getItem('token');

    if (productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`);
            const product = await response.json();

            if (product) {
                document.getElementById('product-image').src = product.image;
                document.getElementById('product-image').alt = product.name;
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
                document.getElementById('product-description').textContent = product.description;

                addToCartButton.addEventListener('click', () => {
                    if (!token) {
                        window.location.href = '/login.html';
                        return;
                    }
                    addToCart(productId, 1);
                });
            } else {
                document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            document.getElementById('product-details').innerHTML = '<p>Error loading product details.</p>';
        }
    } else {
        document.getElementById('product-details').innerHTML = '<p>No product ID specified.</p>';
    }
});

const addToCart = async (productId, qty) => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, qty }),
        });

        if (res.ok) {
            alert('Product added to cart');
            // Optionally, redirect to cart page or update cart count
            window.location.href = '/cart.html';
        } else {
            const data = await res.json();
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart.');
    }
};