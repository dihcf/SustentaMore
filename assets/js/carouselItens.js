
function scrollCarousel(direction) {
  const container = document.getElementById("conteinerCategory");
  const itemWidth = 155; // largura do item + margem
  const itemsToScroll = 3;
  const scrollAmount = itemWidth * itemsToScroll;

  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}

