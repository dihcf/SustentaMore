  // Product state
        let productState = {
            selectedColor: 'Preto',
            selectedSize: '',
            quantity: 1,
            cartCount: 0,
            selectedRating: 0
        };

        // DOM elements
        const elements = {
            mainImage: document.getElementById('main-image'),
            selectedColor: document.getElementById('selected-color'),
            selectedSize: document.getElementById('selected-size'),
            quantity: document.getElementById('quantity'),
            cartCount: document.getElementById('cart-count'),
            successModal: document.getElementById('success-modal'),
            reviewForm: document.getElementById('review-form'),
            questionForm: document.getElementById('question-form'),
            reviewsList: document.getElementById('reviews-list'),
            questionsList: document.getElementById('questions-list')
        };

        // Initialize app
        function init() {
            setupEventListeners();
        }

        // Event listeners
        function setupEventListeners() {
            // Thumbnail images
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', handleImageChange);
            });

            // Color options
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', handleColorChange);
            });

            // Size options
            document.querySelectorAll('.size-option').forEach(option => {
                option.addEventListener('click', handleSizeChange);
            });

            // Quantity controls
            document.getElementById('decrease-qty').addEventListener('click', () => changeQuantity(-1));
            document.getElementById('increase-qty').addEventListener('click', () => changeQuantity(1));

            // Add to cart
            document.getElementById('add-to-cart').addEventListener('click', addToCart);

            // Modal
            document.getElementById('close-modal').addEventListener('click', closeModal);
            elements.successModal.addEventListener('click', handleModalClick);

            // Review form
            document.getElementById('toggle-review-form').addEventListener('click', toggleReviewForm);
            document.getElementById('submit-review').addEventListener('click', submitReview);
            document.getElementById('cancel-review').addEventListener('click', toggleReviewForm);

            // Rating stars
            document.querySelectorAll('.rating-star').forEach(star => {
                star.addEventListener('click', handleRatingClick);
                star.addEventListener('mouseenter', handleRatingHover);
            });

            document.getElementById('rating-input').addEventListener('mouseleave', resetRatingHover);

            // Question form
            document.getElementById('toggle-question-form').addEventListener('click', toggleQuestionForm);
            document.getElementById('submit-question').addEventListener('click', submitQuestion);
            document.getElementById('cancel-question').addEventListener('click', toggleQuestionForm);

            // Like buttons
            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', handleLike);
            });
        }

        // Image handling
        function handleImageChange(e) {
            const imageUrl = e.currentTarget.dataset.image;
            elements.mainImage.src = imageUrl;

            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
        }

        // Color handling
        function handleColorChange(e) {
            const color = e.currentTarget.dataset.color;
            
            // Update active color
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('active');
            });
            e.currentTarget.classList.add('active');

            productState.selectedColor = color;
            elements.selectedColor.textContent = color;
        }

        // Size handling
        function handleSizeChange(e) {
            const size = e.currentTarget.dataset.size;
            
            // Update active size
            document.querySelectorAll('.size-option').forEach(option => {
                option.classList.remove('active');
            });
            e.currentTarget.classList.add('active');

            productState.selectedSize = size;
            elements.selectedSize.textContent = size;
        }

        // Quantity handling
        function changeQuantity(change) {
            const newQuantity = productState.quantity + change;
            if (newQuantity >= 1 && newQuantity <= 10) {
                productState.quantity = newQuantity;
                elements.quantity.textContent = newQuantity;
            }
        }

        // Add to cart
        function addToCart() {
            if (!productState.selectedSize) {
                alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
                return;
            }

            productState.cartCount += productState.quantity;
            elements.cartCount.textContent = productState.cartCount;
            
            elements.successModal.classList.remove('hidden');
            
            // Reset quantity
            productState.quantity = 1;
            elements.quantity.textContent = 1;
        }

        // Modal handling
        function closeModal() {
            elements.successModal.classList.add('hidden');
        }

        function handleModalClick(e) {
            if (e.target === elements.successModal) {
                closeModal();
            }
        }

        // Review form handling
        function toggleReviewForm() {
            elements.reviewForm.classList.toggle('hidden');
            
            if (elements.reviewForm.classList.contains('hidden')) {
                resetReviewForm();
            }
        }

        function handleRatingClick(e) {
            const rating = parseInt(e.target.dataset.rating);
            productState.selectedRating = rating;
            updateRatingDisplay(rating);
        }

        function handleRatingHover(e) {
            const rating = parseInt(e.target.dataset.rating);
            updateRatingDisplay(rating);
        }

        function resetRatingHover() {
            updateRatingDisplay(productState.selectedRating);
        }

        function updateRatingDisplay(rating) {
            document.querySelectorAll('.rating-star').forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        function submitReview() {
            const name = document.getElementById('reviewer-name').value;
            const reviewText = document.getElementById('review-text').value;
            
            if (!name || !reviewText || productState.selectedRating === 0) {
                alert('Por favor, preencha todos os campos e selecione uma nota.');
                return;
            }

            const newReview = createReviewElement(name, reviewText, productState.selectedRating);
            elements.reviewsList.insertBefore(newReview, elements.reviewsList.firstChild);
            
            resetReviewForm();
            toggleReviewForm();
            alert('Avaliação enviada com sucesso!');
        }

        function createReviewElement(name, text, rating) {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review-item';
            
            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            const initial = name.charAt(0).toUpperCase();
            const avatarColors = ['avatar-blue', 'avatar-green', 'avatar-purple', 'avatar-red', 'avatar-yellow'];
            const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
            
            reviewDiv.innerHTML = `
                <div class="review-header">
                    <div class="avatar ${randomColor}">${initial}</div>
                    <div class="review-content">
                        <div class="review-meta">
                            <h4 class="reviewer-name">${name}</h4>
                            <div class="review-stars">${stars}</div>
                            <span class="review-date">• agora</span>
                        </div>
                        <p class="review-text">${text}</p>
                        <div class="review-actions">
                            <button class="like-btn">
                                <span>👍</span>
                                <span class="like-count">0</span>
                            </button>
                            <button class="reply-btn">Responder</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listener to new like button
            reviewDiv.querySelector('.like-btn').addEventListener('click', handleLike);
            
            return reviewDiv;
        }

        function resetReviewForm() {
            document.getElementById('reviewer-name').value = '';
            document.getElementById('review-text').value = '';
            productState.selectedRating = 0;
            updateRatingDisplay(0);
        }

        // Question form handling
        function toggleQuestionForm() {
            elements.questionForm.classList.toggle('hidden');
            
            if (elements.questionForm.classList.contains('hidden')) {
                resetQuestionForm();
            }
        }

        function submitQuestion() {
            const name = document.getElementById('questioner-name').value;
            const questionText = document.getElementById('question-text').value;
            
            if (!name || !questionText) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const newQuestion = createQuestionElement(name, questionText);
            elements.questionsList.insertBefore(newQuestion, elements.questionsList.firstChild);
            
            resetQuestionForm();
            toggleQuestionForm();
            alert('Pergunta enviada com sucesso! Responderemos em breve.');
        }

        function createQuestionElement(name, text) {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            
            questionDiv.innerHTML = `
                <div class="question-header">
                    <div class="qa-badge question-badge">P</div>
                    <span class="questioner-name">${name}</span>
                    <span class="question-date">• agora</span>
                </div>
                <p class="question-text">${text}</p>
                <div class="answer answer-pending">
                    <div class="answer-meta">
                        <div class="qa-badge pending-badge">⏳</div>
                        <span class="store-name">SportShop</span>
                        <span class="question-date">• pendente</span>
                    </div>
                    <p class="answer-text">Sua pergunta foi recebida! Nossa equipe responderá em breve.</p>
                </div>
            `;
            
            return questionDiv;
        }

        function resetQuestionForm() {
            document.getElementById('questioner-name').value = '';
            document.getElementById('question-text').value = '';
        }

        // Like handling
        function handleLike(e) {
            const likeCountSpan = e.currentTarget.querySelector('.like-count');
            const currentCount = parseInt(likeCountSpan.textContent);
            likeCountSpan.textContent = currentCount + 1;
            
            // Visual feedback
            e.currentTarget.style.color = '#3b82f6';
            setTimeout(() => {
                e.currentTarget.style.color = '';
            }, 200);
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
