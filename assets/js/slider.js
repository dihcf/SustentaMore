let currentSlide = 1;
const totalSlides = 5;

  setInterval(() => {
    document.getElementById(`slide${currentSlide}`).checked = false;

    currentSlide++;
    if (currentSlide > totalSlides) {
      currentSlide = 1;
    }

    document.getElementById(`slide${currentSlide}`).checked = true;
  }, 4000); // Troca de slide a cada 4 segundos