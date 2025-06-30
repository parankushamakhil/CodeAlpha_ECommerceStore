// Check authentication state
function checkAuth() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const authLinks = document.getElementById('authLinks');
    const logoutButton = document.getElementById('logoutButton');

    if (userInfo) {
        // User is logged in
        authLinks.innerHTML = `<a href="#"><i class="fas fa-user"></i> ${userInfo.name}</a>`;
        logoutButton.style.display = 'block';
    } else {
        // User is not logged in
        authLinks.innerHTML = '<a href="login.html"><i class="fas fa-user"></i> Login/Register</a>';
        logoutButton.style.display = 'none';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('userInfo');
    window.location.href = 'login.html';
}

async function fetchProducts() {
    const productGrids = document.querySelectorAll('.product-grid');
    productGrids.forEach(grid => {
        const spinner = grid.querySelector('.loading-spinner');
        if (spinner) spinner.style.display = 'flex';
    });

    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        productGrids.forEach(grid => {
            grid.innerHTML = `<div class="error-message">Error loading products: ${error.message}</div>`;
        });
        return [];
    } finally {
        productGrids.forEach(grid => {
            const spinner = grid.querySelector('.loading-spinner');
            if (spinner) spinner.style.display = 'none';
        });
    }
}

function displayProducts(products, elementId) {
    const productGrid = document.querySelector(`#${elementId} .product-grid`);
    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = '<div class="empty-message">No products available</div>';
        return;
    }

    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200x200?text=Product+Image'">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="stock-status ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}">
                ${product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            <button class="add-to-cart" ${product.countInStock === 0 ? 'disabled' : ''}>
                ${product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        `;

        // Add click event for product details
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                window.location.href = `product.html?id=${product._id}`;
            }
        });

        // Add to cart functionality
        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (product.countInStock > 0) {
                addToCart(product);
            }
        });

        productGrid.appendChild(productCard);
    });
}

// Cart functionality
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = `(${count})`;
}

// Add some basic styles for loading and error states
const style = document.createElement('style');
style.textContent = `
    .loading, .error, .no-products {
        padding: 20px;
        text-align: center;
        width: 100%;
    }
    .error {
        color: #dc3545;
    }
    .no-products {
        color: #6c757d;
    }
    .stock {
        color: #28a745;
        font-size: 0.9em;
        margin: 5px 0;
    }
    button:disabled {
        background-color: #6c757d !important;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', async () => {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const cartCountElement = document.getElementById('cart-count');
    const token = localStorage.getItem('token');

    // Handle auth links visibility
    if (token) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }

    // Handle logout
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    });

    const fetchProducts = async () => {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        try {
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            if (productGrid) productGrid.innerHTML = '<p>Error loading products.</p>';
        }
    };

    const displayProducts = (products) => {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <a href="/product?id=${product._id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                </a>
                <button class="add-to-cart-btn" data-id="${product._id}">Add to Cart</button>
            </div>
        `).join('');

        // Re-bind event listeners after rendering
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!token) {
                    window.location.href = '/login';
                    return;
                }
                const productId = e.target.getAttribute('data-id');
                addToCart(productId, 1);
            });
        });
    };

    const addToCart = async (productId, qty) => {
        try {
            const res = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, qty }),
            });

            if (res.ok) {
                alert('Product added to cart');
                updateCartCount();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Could not add product to cart.');
        }
    };

    const updateCartCount = async () => {
        if (!token || !cartCountElement) {
            if (cartCountElement) cartCountElement.textContent = '0';
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const cart = await res.json();
                const count = cart.orderItems ? cart.orderItems.reduce((acc, item) => acc + item.qty, 0) : 0;
                cartCountElement.textContent = count;
            } else {
                cartCountElement.textContent = '0';
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            cartCountElement.textContent = '0';
        }
    };

    // Initial page load
    fetchProducts();
    updateCartCount();
});