
document.addEventListener('DOMContentLoaded', () => {
    const selectOrdenar = document.getElementById('ordenarSelect');
    const container = document.getElementById('conteinerNovidades');

    selectOrdenar.addEventListener('change', () => {
        const items = Array.from(container.querySelectorAll('.itemNovidades'));

        const getPreco = (item) => {
            const textoPreco = item.querySelector('.pricetext p').innerText;
            return parseFloat(textoPreco.replace('R$', '').replace('.', '').replace(',', '.').trim());
        };

        const criterio = selectOrdenar.value;

        if (criterio === 'menorPreco') {
            items.sort((a, b) => getPreco(a) - getPreco(b));
        } else if (criterio === 'maiorPreco') {
            items.sort((a, b) => getPreco(b) - getPreco(a));
        }

        // Limpa o container e reinsere os itens ordenados
        container.innerHTML = '';
        items.forEach(item => container.appendChild(item));
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const precoMinInput = document.getElementById('precoMin');
    const precoMaxInput = document.getElementById('precoMax');
    const container = document.getElementById('conteinerNovidades');

    const getPreco = (item) => {
        const textoPreco = item.querySelector('.pricetext p').innerText;
        return parseFloat(textoPreco.replace('R$', '').replace('.', '').replace(',', '.').trim());
    };

    function filtrarPorPreco() {
        const precoMin = parseFloat(precoMinInput.value);
        const precoMax = parseFloat(precoMaxInput.value);

        const items = container.querySelectorAll('.itemNovidades');

        items.forEach(item => {
            const preco = getPreco(item);
            let mostrar = true;

            if (!isNaN(precoMin) && preco < precoMin) {
                mostrar = false;
            }

            if (!isNaN(precoMax) && preco > precoMax) {
                mostrar = false;
            }

            item.style.display = mostrar ? '' : 'none';
        });
    }

    // Dispara o filtro quando o usuário digitar ou mudar os campos
    precoMinInput.addEventListener('input', filtrarPorPreco);
    precoMaxInput.addEventListener('input', filtrarPorPreco);
});

document.addEventListener('DOMContentLoaded', () => {
  const ratingStars = document.querySelectorAll('#rating-input .rating-star');
  const container = document.getElementById('conteinerNovidades');

  ratingStars.forEach(star => {
    star.addEventListener('click', () => {
      const selectedRating = parseInt(star.getAttribute('data-rating'));

      // Remove destaque anterior
      ratingStars.forEach(s => s.classList.remove('selected'));
      star.classList.add('selected');

      const items = container.querySelectorAll('.itemNovidades');

      items.forEach(item => {
        const ratingText = item.querySelector('.rating-stars')?.innerText || '';
        const itemRating = (ratingText.match(/★/g) || []).length;

        item.style.display = itemRating >= selectedRating ? '' : 'none';
      });
    });
  });
});