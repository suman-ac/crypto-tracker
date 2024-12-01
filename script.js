const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const currency = 'usd';
const maxComparison = 5;

const cryptoListSection = document.getElementById('crypto-list');
const comparisonContainer = document.getElementById('comparison-container');
const favoritesList = document.getElementById('favorites-list');
const sortOption = document.getElementById('sort-option');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];

function fetchCryptoData() {
    fetch(`${apiUrl}?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1`)
        .then(response => response.json())
        .then(data => {
            displayCryptoList(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayCryptoList(data) {
    cryptoListSection.innerHTML = '';
    data.forEach(crypto => {
        const card = document.createElement('div');
        card.classList.add('crypto-card');
        card.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price.toFixed(2)}</p>
            <p>24H Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            <button onclick="addToComparison('${crypto.id}')">Compare</button>
        `;
        cryptoListSection.appendChild(card);
    });
}

function addToComparison(cryptoId) {
    if (comparisonList.length >= maxComparison) {
        alert('You can only compare up to 5 cryptocurrencies.');
        return;
    }
    if (!comparisonList.includes(cryptoId)) {
        comparisonList.push(cryptoId);
        localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
        updateComparisonSection();
    }
}

function updateComparisonSection() {
    comparisonContainer.innerHTML = '';
    comparisonList.forEach(cryptoId => {
        fetch(`${apiUrl}?vs_currency=${currency}&ids=${cryptoId}`)
            .then(response => response.json())
            .then(data => {
                const crypto = data[0];
                const card = document.createElement('div');
                card.classList.add('comparison-card');
                card.innerHTML = `
                    <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                    <p>Price: $${crypto.current_price.toFixed(2)}</p>
                    <p>24H Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
                    <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
                    <button onclick="removeFromComparison('${crypto.id}')">Remove</button>
                `;
                comparisonContainer.appendChild(card);
            });
    });
}

function removeFromComparison(cryptoId) {
    comparisonList = comparisonList.filter(id => id !== cryptoId);
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
    updateComparisonSection();
}

function updateFavorites() {
    favoritesList.innerHTML = '';
    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.textContent = fav;
        favoritesList.appendChild(li);
    });
}

function updateSorting() {
    fetchCryptoData();
}

sortOption.addEventListener('change', updateSorting);

document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();
    updateComparisonSection();
    updateFavorites();
});
