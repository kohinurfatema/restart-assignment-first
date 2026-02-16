// API Base URL
const API_URL = 'https://fakestoreapi.com';

// Global variables
let allProducts = [];
let cart = [];
let categories = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    loadCategories();
    loadAllProducts();
    updateCartUI();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Footer newsletter form
    const footerNewsletterForm = document.getElementById('footer-newsletter-form');
    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartButton = e.target.closest('[onclick="toggleCart()"]');

        if (!cartSidebar.contains(e.target) && !cartButton && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    });
}

// Load categories from API
async function loadCategories() {
    const categoryFilters = document.getElementById('category-filters');
    if (!categoryFilters) return;

    try {
        const response = await fetch(`${API_URL}/products/categories`);
        categories = await response.json();

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.textContent = capitalizeWords(category);
            button.dataset.category = category;
            button.addEventListener('click', () => filterByCategory(category));
            categoryFilters.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        showError('Failed to load categories');
    }
}

// Load all products
async function loadAllProducts() {
    const productsContainer = document.getElementById('products-container');
    const trendingContainer = document.getElementById('trending-products');

    if (productsContainer) showLoading('products-container');

    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();

        if (trendingContainer) displayTrendingProducts();
        if (productsContainer) displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products');
    }
}

// Filter products by category
async function filterByCategory(category) {
    try {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category || (category === 'all' && btn.textContent === 'All')) {
                btn.classList.add('active');
            }
        });

        showLoading('products-container');

        let products;
        if (category === 'all') {
            products = allProducts;
        } else {
            const response = await fetch(`${API_URL}/products/category/${category}`);
            products = await response.json();
        }

        displayProducts(products);
    } catch (error) {
        console.error('Error filtering products:', error);
        showError('Failed to filter products');
    }
}

// Display products in grid
function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No products found</div>';
        return;
    }

    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML (for products section)
function createProductCard(product) {
    const { id, title, price, image, category, rating } = product;

    return `
        <div class="card bg-white shadow-lg hover:shadow-xl transition-all">
            <figure class="px-6 pt-6">
                <img src="${image}" alt="${title}" class="rounded-xl h-64 object-contain" />
            </figure>
            <div class="card-body p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-blue-600 text-sm font-medium">${capitalizeWords(category)}</span>
                    <div class="flex items-center gap-1">
                        <i class="fas fa-star text-yellow-400"></i>
                        <span class="text-sm font-semibold">${rating.rate}</span>
                        <span class="text-gray-500 text-sm">(${rating.count})</span>
                    </div>
                </div>
                <h3 class="text-base font-semibold mb-3 line-clamp-2 min-h-[3rem]">${title}</h3>
                <p class="text-xl font-bold text-gray-800 mb-4">$${price.toFixed(2)}</p>
                <div class="flex gap-3">
                    <button onclick="showProductDetails(${id})" class="btn btn-outline btn-sm flex-1" style="border-color: #d1d5db; color: #6b7280;">
                        <i class="fas fa-eye"></i>
                        Details
                    </button>
                    <button onclick="addToCart(${id})" class="btn btn-sm flex-1" style="background-color: #5B4FEF; color: white; border: none;">
                        <i class="fas fa-cart-plus"></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Display trending products (top 3 by rating)
function displayTrendingProducts() {
    const container = document.getElementById('trending-products');
    if (!container) return;

    const trending = [...allProducts]
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 3);

    container.innerHTML = trending.map(product => createTrendingCard(product)).join('');
}

// Create trending product card HTML (matching screenshot 4)
function createTrendingCard(product) {
    const { id, title, price, image, category, rating } = product;

    return `
        <div class="card bg-white shadow-lg hover:shadow-xl transition-all">
            <figure class="px-6 pt-6">
                <img src="${image}" alt="${title}" class="rounded-xl h-64 object-contain" />
            </figure>
            <div class="card-body">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-blue-600 text-sm font-medium">${capitalizeWords(category)}</span>
                    <div class="flex items-center gap-1">
                        <i class="fas fa-star text-yellow-400"></i>
                        <span class="text-sm font-semibold">${rating.rate}</span>
                        <span class="text-gray-500 text-sm">(${rating.count})</span>
                    </div>
                </div>
                <h3 class="text-lg font-semibold mb-3 line-clamp-2">${title}</h3>
                <p class="text-2xl font-bold text-gray-800 mb-4">$${price.toFixed(2)}</p>
                <div class="flex gap-3">
                    <button onclick="showProductDetails(${id})" class="btn btn-outline flex-1" style="border-color: #5B4FEF; color: #5B4FEF;">
                        <i class="fas fa-eye"></i>
                        Details
                    </button>
                    <button onclick="addToCart(${id})" class="btn flex-1" style="background-color: #5B4FEF; color: white; border: none;">
                        <i class="fas fa-cart-plus"></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create star rating HTML
function createStarRating(rate) {
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        } else {
            stars += '<i class="far fa-star star empty"></i>';
        }
    }

    return `<div class="star-rating">${stars}</div>`;
}

// Show product details in modal
async function showProductDetails(productId) {
    try {
        const product = allProducts.find(p => p.id === productId);

        if (!product) {
            showError('Product not found');
            return;
        }

        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div class="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                    <img src="${product.image}" alt="${product.title}" class="modal-product-image" />
                </div>
                <div>
                    <span class="badge badge-secondary mb-2">${capitalizeWords(product.category)}</span>
                    <h3 class="text-2xl font-bold mb-4">${product.title}</h3>
                    <div class="flex items-center gap-2 mb-4">
                        ${createStarRating(product.rating.rate)}
                        <span class="text-sm text-gray-600">(${product.rating.count} reviews)</span>
                    </div>
                    <p class="text-gray-700 mb-6">${product.description}</p>
                    <div class="flex items-center justify-between mb-6">
                        <p class="text-3xl font-bold text-blue-600">$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="addToCart(${product.id}); document.getElementById('product-modal').close();" class="btn flex-1" style="background-color: #5B4FEF; color: white; border: none;">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                        <button onclick="addToCart(${product.id}); document.getElementById('product-modal').close(); toggleCart();" class="btn flex-1" style="background-color: #10b981; color: white; border: none;">
                            <i class="fas fa-shopping-bag"></i>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('product-modal').showModal();
    } catch (error) {
        console.error('Error showing product details:', error);
        showError('Failed to load product details');
    }
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);

    if (!product) {
        showError('Product not found');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    showNotification('Product added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    showNotification('Product removed from cart');
}

// Update cart quantity
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p class="text-lg font-semibold">Your cart is empty</p>
                <p class="text-sm">Add some products to get started!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" />
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title.substring(0, 40)}...</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateCartQuantity(${item.id}, -1)" class="btn btn-xs btn-outline">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="font-semibold">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.id}, 1)" class="btn btn-xs btn-outline">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="btn btn-sm btn-ghost btn-circle">
                    <i class="fas fa-trash text-error"></i>
                </button>
            </div>
        `).join('');
    }

    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (confirm(`Checkout ${itemCount} items for $${total.toFixed(2)}?`)) {
        showNotification('Order placed successfully! Thank you for shopping with SwiftCart!', 'success');
        cart = [];
        saveCartToStorage();
        updateCartUI();
        toggleCart();
    }
}

// LocalStorage functions
function saveCartToStorage() {
    localStorage.setItem('swiftcart-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('swiftcart-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Newsletter form handler
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    showNotification(`Thank you for subscribing with ${email}!`, 'success');
    e.target.reset();
}

// Utility functions
function capitalizeWords(str) {
    return str.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <div class="flex justify-center col-span-full py-12">
            <span class="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
    `;
}

function showError(message) {
    console.error(message);
    showNotification(message, 'error');
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} fixed top-4 right-4 w-auto max-w-md z-50 shadow-lg`;
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.style.opacity = '1', 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
