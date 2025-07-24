document.addEventListener('DOMContentLoaded', () => {
    const userBtn = document.querySelector('#user-btn');
    const cartBtn = document.querySelector('#cart-btn');
    const menuBtn = document.querySelector('#menu-btn');

    const loginFormContainer = document.querySelector('.login-form-container');
    const registerFormContainer = document.querySelector('.register-form-container');
    const cartContainer = document.querySelector('.cart-container');
    const paymentContainer = document.querySelector('.payment-container');

    const closeLoginBtn = document.querySelector('#close-login-btn');
    const closeRegisterBtn = document.querySelector('#close-register-btn');
    const closeCartBtn = document.querySelector('#close-cart-btn');
    const closePaymentBtn = document.querySelector('#close-payment-btn');

    const registerLink = document.querySelector('#register-link');
    const loginLink = document.querySelector('#login-link');
    const checkoutBtn = document.querySelector('#checkout-btn');
    const payNowBtn = document.querySelector('#pay-now-btn');

    const cartCountSpan = document.querySelector('#cart-count');
    const cartContentDiv = document.querySelector('.cart-content');
    const cartTotalSpan = document.querySelector('#cart-total');
    const paymentSummaryDiv = document.querySelector('#payment-summary');
    const paymentTotalSpan = document.querySelector('#payment-total');

    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cardDetailsDiv = document.querySelector('#card-details');
    const upiDetailsDiv = document.querySelector('#upi-details');
    const netBankingDetailsDiv = document.querySelector('#net-banking-details');

    const productsContainer = document.querySelector('.product-container');

    let cart = [];

    // Sample product data (replace with your actual data)
    const productsData = [
        { id: 1, name: 'Laptop', price: 49999, image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGFwdG9wfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60', discount: '20%' },
        { id: 2, name: 'Smartphone', price: 29999, image: 'https://images.unsplash.com/photo-1520353854186-94ef91585b3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c21hcnRwaG9uZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60', discount: '15%' },
        { id: 3, name: 'Headphones', price: 1999, image: 'https://images.unsplash.com/photo-1505740420928-4a560101d583?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGVhZHBob25lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60' },
        { id: 4, name: 'Smartwatch', price: 7999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c21hcnR3YXRjaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60', discount: '10%' },
        { id: 5, name: 'T-Shirt', price: 599, image: 'https://images.unsplash.com/photo-1576566588028-b99c8e72c904?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dCUyMHNoaXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60' },
        { id: 6, name: 'Shoes', price: 3499, image: 'https://images.unsplash.com/photo-1542298476-e07791d13049?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2hvZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60', discount: '5%' },
    ];

    // Function to render products
    function renderProducts() {
        productsContainer.innerHTML = productsData.map(product => `
            <div class="product-box" data-product-id="${product.id}">
                ${product.discount ? `<span class="discount">${product.discount}</span>` : ''}
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="content">
                    <h3>${product.name}</h3>
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                    <div class="price">₹${product.price} ${product.discount ? `<span>₹${(product.price * (1 + parseFloat(product.discount) / 100)).toFixed(2)}</span>` : ''}</div>
                    <button class="btn add-to-cart">Add to cart</button>
                </div>
            </div>
        `).join('');

        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.closest('.product-box').dataset.productId);
                const selectedProduct = productsData.find(p => p.id === productId);
                if (selectedProduct) {
                    addToCart(selectedProduct);
                }
            });
        });
    }

    renderProducts();

    // Function to update cart display
    function updateCartDisplay() {
        cartContentDiv.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-box');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="detail">
                    <h3>${item.name}</h3>
                    <div class="price">₹${item.price}</div>
                    <div class="quantity">Qty: ${item.quantity}</div>
                </div>
                <i class="fas fa-trash" data-product-id="${item.id}"></i>
            `;
            cartContentDiv.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });
        cartTotalSpan.textContent = total.toFixed(2);
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Update payment summary
        paymentSummaryDiv.innerHTML = cart.map(item => `
            <div class="summary-item">${item.name} x ${item.quantity} <span>₹${(item.price * item.quantity).toFixed(2)}</span></div>
        `).join('');
        paymentTotalSpan.textContent = total.toFixed(2);

        // Add event listeners for remove items
        const removeCartItems = document.querySelectorAll('.cart-box .fa-trash');
        removeCartItems.forEach(removeButton => {
            removeButton.addEventListener('click', function() {
                const productIdToRemove = parseInt(this.dataset.productId);
                removeFromCart(productIdToRemove);
            });
        });
    }

    // Function to add item to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartDisplay();
        showAlert('Product added to cart!', 'success');
    }

    // Function to remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        showAlert('Product removed from cart!', 'info');
    }

    // Event listeners for showing/hiding forms and containers
    userBtn.addEventListener('click', () => {
        loginFormContainer.classList.add('active');
    });

    cartBtn.addEventListener('click', () => {
        cartContainer.classList.add('active');
        updateCartDisplay(); // Ensure cart is updated when opened
    });

    menuBtn.addEventListener('click', () => {
        document.querySelector('header nav').classList.toggle('active');
    });

    closeLoginBtn.addEventListener('click', () => {
        loginFormContainer.classList.remove('active');
    });

    closeRegisterBtn.addEventListener('click', () => {
        registerFormContainer.classList.remove('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartContainer.classList.remove('active');
    });

    closePaymentBtn.addEventListener('click', () => {
        paymentContainer.classList.remove('active');
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.remove('active');
        registerFormContainer.classList.add('active');
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.classList.remove('active');
        loginFormContainer.classList.add('active');
    });

    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length > 0) {
            cartContainer.classList.remove('active');
            paymentContainer.classList.add('active');
        } else {
            showAlert('Your cart is empty!', 'error');
        }
    });

    payNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Implement your payment processing logic here
        showAlert('Payment successful!', 'success');
        cart = [];
        updateCartDisplay();
        paymentContainer.classList.remove('active');
    });

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            cardDetailsDiv.style.display = this.value === 'credit-card' ? 'block' : 'none';
            upiDetailsDiv.style.display = this.value === 'upi' ? 'block' : 'none';
            netBankingDetailsDiv.style.display = this.value === 'net-banking' ? 'block' : 'none';
        });
    });

    // Function to display alerts
    function showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});
