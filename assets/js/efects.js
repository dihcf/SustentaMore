document.addEventListener("DOMContentLoaded", () => {
    const hearts = document.querySelectorAll('.favadd .imagefav:first-child');

    hearts.forEach(heart => {
      heart.addEventListener("click", (event) => {
        event.stopPropagation();
        const isFavorited = heart.dataset.favorited === "true";

        heart.src = isFavorited
          ? "assets/images/icons/heart.png"
          : "assets/images/icons/hred.png";

        heart.dataset.favorited = !isFavorited;
      });
    });
    
     
  const carts = document.querySelectorAll('.favadd .imagefav:last-child');
  const cartCountEl = document.getElementById("cart-count");
  let cartCount = parseInt(cartCountEl.textContent) || 0;

  carts.forEach(cart => {
    cart.addEventListener("click", (event) => {
         event.stopPropagation();
      const isFavorited = cart.dataset.favorited === "true";

      // Alternar imagem e atualizar contador
      if (!isFavorited) {
        cart.src = "assets/images/icons/shopping-cart.png";
        cartCount += 1;
      } else {
        cart.src = "assets/images/icons/add-to-cart.png";
        cartCount = Math.max(0, cartCount - 1); // Evita número negativo
      }

      cart.dataset.favorited = !isFavorited;
      cartCountEl.textContent = cartCount;
    });
  });


  });

let selectedRating = 0;

document.querySelectorAll('.rating-star').forEach(star => {
    star.addEventListener('click', e => {
        selectedRating = parseInt(e.target.dataset.rating);
        updateRatingDisplay(selectedRating);
    });

    star.addEventListener('mouseenter', e => {
        const rating = parseInt(e.target.dataset.rating);
        updateRatingDisplay(rating);
    });
});

document.getElementById('rating-input').addEventListener('mouseleave', () => {
    updateRatingDisplay(selectedRating);
});

function updateRatingDisplay(rating) {
    document.querySelectorAll('.rating-star').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}
