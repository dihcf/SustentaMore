   // Sample credit and debit cards data
        const creditCards = [
            { id: 1, brand: 'visa', number: '•••• •••• •••• 1234', name: 'João Silva', type: 'credit' },
            { id: 2, brand: 'mastercard', number: '•••• •••• •••• 5678', name: 'João Silva', type: 'credit' },
            { id: 3, brand: 'amex', number: '•••• •••• •••• 9012', name: 'João Silva', type: 'credit' }
        ];

        const debitCards = [
            { id: 4, brand: 'mastercard', number: '•••• •••• •••• 5678', name: 'João Silva', type: 'debit' },
            { id: 5, brand: 'visa', number: '•••• •••• •••• 9999', name: 'João Silva', type: 'debit' }
        ];

        let currentCardType = 'credit';

        // DOM Elements
        const selectAllCheckbox = document.getElementById('select-all');
        const productCheckboxes = document.querySelectorAll('.product-item input[type="checkbox"]');
        const storeCheckboxes = document.querySelectorAll('.store-header input[type="checkbox"]');
        const quantityButtons = document.querySelectorAll('.quantity-btn');
        const removeButtons = document.querySelectorAll('.remove-btn');
        const paymentRadios = document.querySelectorAll('input[name="payment"]');
        const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
        const couponBtn = document.querySelector('.coupon-btn');
        const couponInput = document.getElementById('coupon-input');
        const cardModal = document.getElementById('card-modal');
        const addCardModal = document.getElementById('add-card-modal');
        const closeButtons = document.querySelectorAll('.close-btn');
        const changeCreditCardBtn = document.querySelector('.change-credit-card');
        const changeDebitCardBtn = document.querySelector('.change-debit-card');
        const addCardBtn = document.querySelector('.add-card-btn');
        const addCardForm = document.getElementById('add-card-form');

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateSummary();
            setupEventListeners();
        });

        function setupEventListeners() {
            // Select all functionality
            selectAllCheckbox.addEventListener('change', handleSelectAll);
            
            // Product checkboxes
            productCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateSummary);
            });

            // Store checkboxes
            storeCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', handleStoreSelection);
            });

            // Quantity controls
            quantityButtons.forEach(button => {
                button.addEventListener('click', handleQuantityChange);
            });

            // Remove buttons
            removeButtons.forEach(button => {
                button.addEventListener('click', handleRemoveItem);
            });

            // Payment method changes
            paymentRadios.forEach(radio => {
                radio.addEventListener('change', handlePaymentChange);
            });

            // Delivery method changes
            deliveryRadios.forEach(radio => {
                radio.addEventListener('change', handleDeliveryChange);
            });

            // Coupon
            couponBtn.addEventListener('click', applyCoupon);
            couponInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    applyCoupon();
                }
            });

            // Modal controls
            closeButtons.forEach(button => {
                button.addEventListener('click', closeModals);
            });

            // Card selection
            if (changeCreditCardBtn) {
                changeCreditCardBtn.addEventListener('click', () => openCardModal('credit'));
            }
            if (changeDebitCardBtn) {
                changeDebitCardBtn.addEventListener('click', () => openCardModal('debit'));
            }

            // Add card
            if (addCardBtn) {
                addCardBtn.addEventListener('click', openAddCardModal);
            }

            // Add card form
            if (addCardForm) {
                addCardForm.addEventListener('submit', handleAddCard);
            }

            // Card number formatting
            const cardNumberInput = document.getElementById('card-number');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', formatCardNumber);
            }

            // Card expiry formatting
            const cardExpiryInput = document.getElementById('card-expiry');
            if (cardExpiryInput) {
                cardExpiryInput.addEventListener('input', formatCardExpiry);
            }

            // Modal overlay clicks
            document.querySelectorAll('.modal-overlay').forEach(overlay => {
                overlay.addEventListener('click', function(e) {
                    if (e.target === overlay) {
                        closeModals();
                    }
                });
            });
        }

        function handleSelectAll() {
            const isChecked = selectAllCheckbox.checked;
            productCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            storeCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateSummary();
        }

        function handleStoreSelection(e) {
            const storeCard = e.target.closest('.card');
            const storeProductCheckboxes = storeCard.querySelectorAll('.product-item input[type="checkbox"]');
            const isChecked = e.target.checked;
            
            storeProductCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            
            updateSummary();
        }

        function handleQuantityChange(e) {
            const button = e.target;
            const quantityDisplay = button.parentElement.querySelector('.quantity-display');
            const productItem = button.closest('.product-item');
            let currentQuantity = parseInt(quantityDisplay.textContent);
            
            if (button.classList.contains('quantity-increase')) {
                currentQuantity++;
            } else if (button.classList.contains('quantity-decrease') && currentQuantity > 1) {
                currentQuantity--;
            }
            
            quantityDisplay.textContent = currentQuantity;
            updateSummary();
        }

        function handleRemoveItem(e) {
            const productItem = e.target.closest('.product-item');
            productItem.style.opacity = '0.5';
            productItem.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                productItem.remove();
                updateSummary();
                showNotification('Item removido do carrinho');
            }, 300);
        }

        function handlePaymentChange(e) {
            const paymentMethod = e.target.value;
            const creditCardDetails = document.getElementById('credit-card-details');
            const debitCardDetails = document.getElementById('debit-card-details');
            
            // Hide all card details
            creditCardDetails.classList.add('hidden');
            debitCardDetails.classList.add('hidden');
            
            // Show relevant card details
            if (paymentMethod === 'credit') {
                creditCardDetails.classList.remove('hidden');
            } else if (paymentMethod === 'debit') {
                debitCardDetails.classList.remove('hidden');
            }
            
            updateSummary();
        }

        function handleDeliveryChange() {
            updateSummary();
        }

        function updateSummary() {
            let subtotal = 0;
            let itemCount = 0;
            
            // Calculate subtotal from checked items
            productCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const productItem = checkbox.closest('.product-item');
                    const price = parseFloat(productItem.dataset.price);
                    const quantity = parseInt(productItem.querySelector('.quantity-display').textContent);
                    subtotal += price * quantity;
                    itemCount += quantity;
                }
            });
            
            // Update subtotal display
            document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            
            // Update item count in select all label
            const selectAllLabel = document.querySelector('.select-all-label');
            selectAllLabel.textContent = `Selecionar todos os itens (${itemCount})`;
            
            // Calculate shipping
            let shipping = 0;
            const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
            if (selectedDelivery && selectedDelivery.value === 'express') {
                shipping = 15.90;
            } else if (selectedDelivery && selectedDelivery.value === 'same-day') {
                shipping = 29.90;
            }
            
            // Add Casa Verde shipping if any Casa Verde items are selected
            const casaVerdeItems = document.querySelectorAll('.card:nth-child(3) .product-item input[type="checkbox"]:checked');
            if (casaVerdeItems.length > 0) {
                shipping += 12.90;
            }
            
            // Calculate discount based on payment method
            let discount = 0;
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            if (selectedPayment) {
                if (selectedPayment.value === 'pix') {
                    discount = subtotal * 0.05; // 5% discount
                } else if (selectedPayment.value === 'boleto') {
                    discount = subtotal * 0.03; // 3% discount
                }
            }
            
            // Show/hide discount row
            const discountRow = document.getElementById('discount-row');
            const discountAmount = document.getElementById('discount-amount');
            if (discount > 0) {
                discountRow.classList.remove('hidden');
                discountAmount.textContent = `-R$ ${discount.toFixed(2).replace('.', ',')}`;
            } else {
                discountRow.classList.add('hidden');
            }
            
            // Calculate total
            const total = subtotal + shipping - discount;
            document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }

        function applyCoupon() {
            const couponCode = couponInput.value.trim().toUpperCase();
            const validCoupons = {
                'ECO10': 0.10,
                'VERDE15': 0.15,
                'SUSTENTAVEL20': 0.20
            };
            
            if (validCoupons[couponCode]) {
                const discount = validCoupons[couponCode];
                showNotification(`Cupom aplicado! ${(discount * 100)}% de desconto`);
                couponInput.value = '';
                // Apply discount logic here
                updateSummary();
            } else if (couponCode) {
                showNotification('Cupom inválido', 'error');
            }
        }

        function openCardModal(type) {
            currentCardType = type;
            const modal = cardModal;
            const title = document.getElementById('modal-title');
            const cardsList = document.getElementById('cards-list');
            
            title.textContent = type === 'credit' ? 'Selecionar Cartão de Crédito' : 'Selecionar Cartão de Débito';
            
            const cards = type === 'credit' ? creditCards : debitCards;
            
            cardsList.innerHTML = cards.map(card => `
                <div class="card-item" data-card-id="${card.id}">
                    <div class="card-item-content">
                        <div class="card-item-left">
                            <input type="radio" name="selected-card" value="${card.id}">
                            <div class="card-brand ${card.brand}">
                                ${card.brand.toUpperCase()}
                            </div>
                            <div class="card-details">
                                <h4>${card.number}</h4>
                                <p>${card.name}</p>
                            </div>
                        </div>
                        <button class="remove-card-btn" data-card-id="${card.id}">Remover</button>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners to card items
            cardsList.querySelectorAll('.card-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.classList.contains('remove-card-btn')) {
                        const radio = this.querySelector('input[type="radio"]');
                        radio.checked = true;
                        selectCard(parseInt(radio.value));
                    }
                });
            });
            
            // Add event listeners to remove buttons
            cardsList.querySelectorAll('.remove-card-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    removeCard(parseInt(this.dataset.cardId));
                });
            });
            
            modal.classList.add('active');
        }

        function selectCard(cardId) {
            const cards = currentCardType === 'credit' ? creditCards : debitCards;
            const selectedCard = cards.find(card => card.id === cardId);
            
            if (selectedCard) {
                const displayElement = currentCardType === 'credit' 
                    ? document.getElementById('selected-credit-card')
                    : document.getElementById('selected-debit-card');
                
                displayElement.textContent = `${selectedCard.brand.charAt(0).toUpperCase() + selectedCard.brand.slice(1)} ${selectedCard.number}`;
                closeModals();
                showNotification('Cartão selecionado com sucesso!');
            }
        }

        function removeCard(cardId) {
            if (currentCardType === 'credit') {
                const index = creditCards.findIndex(card => card.id === cardId);
                if (index > -1) {
                    creditCards.splice(index, 1);
                }
            } else {
                const index = debitCards.findIndex(card => card.id === cardId);
                if (index > -1) {
                    debitCards.splice(index, 1);
                }
            }
            
            // Refresh the modal
            openCardModal(currentCardType);
            showNotification('Cartão removido');
        }

        function openAddCardModal() {
            closeModals();
            addCardModal.classList.add('active');
        }

        function handleAddCard(e) {
            e.preventDefault();
            
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            
            if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                showNotification('Por favor, preencha todos os campos', 'error');
                return;
            }
            
            // Determine card brand based on number
            let brand = 'visa';
            if (cardNumber.startsWith('5')) {
                brand = 'mastercard';
            } else if (cardNumber.startsWith('3')) {
                brand = 'amex';
            }
            
            // Create new card object
            const newCard = {
                id: Date.now(),
                brand: brand,
                number: `•••• •••• •••• ${cardNumber.slice(-4)}`,
                name: cardName,
                type: currentCardType
            };
            
            // Add to appropriate array
            if (currentCardType === 'credit') {
                creditCards.push(newCard);
            } else {
                debitCards.push(newCard);
            }
            
            closeModals();
            showNotification('Cartão adicionado com sucesso!');
            
            // Reset form
            addCardForm.reset();
        }

        function formatCardNumber(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        }

        function formatCardExpiry(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        }

        function closeModals() {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.classList.remove('active');
            });
        }

        function showNotification(message, type = 'success') {
            // Remove existing notification
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create new notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            if (type === 'error') {
                notification.style.background = '#fef2f2';
                notification.style.borderColor = '#fecaca';
                notification.style.color = '#991b1b';
            }
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        