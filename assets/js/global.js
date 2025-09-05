        // Sample cart data
        const cartItems = [
            {
                id: 1,
                title: "Shampoo Orgânico Natural",
                price: 89.90,
                quantity: 1,
                image: "assets/images/products/produto (2).jpeg"
            },
            {
                id: 2,
                title: "Kit 3 Esponjas Biodegradáveis",
                price: 45.50,
                quantity: 2,
                image: "assets/images/products/produto (1).jpeg"
            },
            {
                id: 3,
                title: "Camiseta Algodão Orgânico",
                price: 125.00,
                quantity: 1,
                image: "assets/images/products/produto (3).jpeg"
            }
        ];


       // DOM Elements
        const cartArea = document.getElementById('cartArea');
        const sideCart = document.getElementById('side-cart');
        const sideCartOverlay = document.getElementById('side-cart-overlay');
        const sideCartClose = document.getElementById('side-cart-close');
        const sideCartContent = document.getElementById('side-cart-content');
        const continueShopping = document.getElementById('continue-shopping');
        const goToCart = document.getElementById('go-to-cart');

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            setupEventListeners();
            populateSideCart();
        });

        function setupEventListeners() {
            // Toggle side cart when cartArea is clicked
            cartArea.addEventListener('click', toggleSideCart);

            // Close side cart
            sideCartClose.addEventListener('click', closeSideCart);
            sideCartOverlay.addEventListener('click', closeSideCart);
            continueShopping.addEventListener('click', closeSideCart);

            // Go to cart action
            goToCart.addEventListener('click', function(e) {
                e.preventDefault();
                closeSideCart();
                showNotification('Redirecionando para o carrinho...');
            });

            // Keyboard support
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && sideCart.classList.contains('active')) {
                    closeSideCart();
                }
            });
        }

        function toggleSideCart() {
            if (sideCart.classList.contains('active')) {
                closeSideCart();
            } else {
                openSideCart();
            }
        }

        function openSideCart() {
            sideCart.classList.add('active');
            sideCartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Update cart content
            populateSideCart();
        }

        function closeSideCart() {
            sideCart.classList.remove('active');
            sideCartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function populateSideCart() {
            if (cartItems.length === 0) {
                sideCartContent.innerHTML = `
                    <div class="side-cart-empty">
                        <div class="side-cart-empty-icon">🛒</div>
                        <div class="side-cart-empty-text">Seu carrinho está vazio</div>
                        <div class="side-cart-empty-subtext">Adicione produtos para continuar</div>
                    </div>
                `;
            } else {
                sideCartContent.innerHTML = cartItems.map((item, index) => `
                    <div class="side-cart-item slide-in" style="animation-delay: ${index * 0.1}s">
                        <img src="${item.image}" alt="${item.title}" class="side-cart-item-image">
                        <div class="side-cart-item-details">
                            <div class="side-cart-item-title">${item.title}</div>
                            <div class="side-cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                            <div class="side-cart-item-controls">
                                <div class="side-cart-quantity">
                                    <button class="side-cart-quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                                    <span class="side-cart-quantity-display">${item.quantity}</span>
                                    <button class="side-cart-quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                </div>
                                <button class="side-cart-remove" onclick="removeItem(${item.id})">Remover</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
            
            updateSummary();
        }

        function updateQuantity(itemId, change) {
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                if (change > 0) {
                    item.quantity++;
                } else if (change < 0 && item.quantity > 1) {
                    item.quantity--;
                }
                
                populateSideCart();
                showNotification('Quantidade atualizada!');
            }
        }

        function removeItem(itemId) {
            const itemIndex = cartItems.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                const itemElement = document.querySelector(`[onclick="removeItem(${itemId})"]`).closest('.side-cart-item');
                itemElement.classList.add('fade-out');
                
                setTimeout(() => {
                    cartItems.splice(itemIndex, 1);
                    populateSideCart();
                    updateCartBadge();
                    showNotification('Item removido do carrinho');
                }, 300);
            }
        }

        function updateSummary() {
            let subtotal = 0;
            let totalItems = 0;
            
            cartItems.forEach(item => {
                subtotal += item.price * item.quantity;
                totalItems += item.quantity;
            });
            
            const shipping = subtotal > 200 ? 0 : 12.90;
            const total = subtotal + shipping;
            
            document.getElementById('side-cart-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            document.getElementById('side-cart-shipping').textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
            document.getElementById('side-cart-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            
            updateCartBadge(totalItems);
        }

        function updateCartBadge(count = null) {
            const badge = document.querySelector('.cart-badge');
            if (count === null) {
                count = cartItems.reduce((total, item) => total + item.quantity, 0);
            }
            badge.textContent = count;
            
            if (count === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
        }

        function showNotification(message) {
            // Remove existing notification
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create new notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #d1fae5;
                border: 1px solid #a7f3d0;
                color: #065f46;
                padding: 16px 20px;
                border-radius: 8px;
                z-index: 3000;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                animation: slideInNotification 0.3s ease-out;
                font-weight: 500;
            `;
            
            // Add animation keyframes
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideInNotification {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideInNotification 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        goToCart.addEventListener("click", ()=>{
            window.location.href = "carinho.html";
        })

        // Initialize cart badge
        updateCartBadge();