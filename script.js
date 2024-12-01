const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
const currency = "usd";
const maxComparison = 5;

const cryptoListSection = document.getElementById("crypto-list");
const comparisonContainer = document.getElementById("comparison-container");
const favoritesContainer = document.getElementById("favorites-container");
const sortOption = document.getElementById("sort-option");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let comparisonList = JSON.parse(localStorage.getItem("comparisonList")) || [];
let cryptoData = []; 

function fetchCryptoData() {
  fetch(
    `${apiUrl}?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1`
  )
    .then((response) => response.json())
    .then((data) => {
        cryptoData = data;
      displayCryptoList(cryptoData);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayCryptoList(data) {
  cryptoListSection.innerHTML = "";
  data.forEach((crypto) => {
    const card = document.createElement("div");
    card.classList.add("crypto-card");
    card.innerHTML = `
      <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
      <p>Price: $${crypto.current_price.toFixed(2)}</p>
      <p>24H Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
      <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
      <button class="compare" onclick="addToComparison('${crypto.id}')">Compare</button>
      <button class="favorite" onclick="addToFavorites('${crypto.id}', '${crypto.name}', '${crypto.symbol}', ${crypto.current_price}, ${crypto.price_change_percentage_24h}, ${crypto.market_cap})">Favorite</button>
    `;
    cryptoListSection.appendChild(card);
  });
}

function addToComparison(cryptoId) {
  if (comparisonList.length >= maxComparison) {
    alert("You can only compare up to 5 cryptocurrencies.");
    return;
  }
  if (!comparisonList.includes(cryptoId)) {
    comparisonList.push(cryptoId);
    localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
    updateComparisonSection();
  }
}

function updateComparisonSection() {
  comparisonContainer.innerHTML = "";
  comparisonList.forEach((cryptoId) => {
    fetch(`${apiUrl}?vs_currency=${currency}&ids=${cryptoId}`)
      .then((response) => response.json())
      .then((data) => {
        const crypto = data[0];
        const card = document.createElement("div");
        card.classList.add("comparison-card");
        card.innerHTML = `
          <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
          <p>Price: $${crypto.current_price.toFixed(2)}</p>
          <p>24H Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
          <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
          <button class="remove" onclick="removeFromComparison('${crypto.id}')">Remove</button>
        `;
        comparisonContainer.appendChild(card);
      });
  });
}

function removeFromComparison(cryptoId) {
  comparisonList = comparisonList.filter((id) => id !== cryptoId);
  localStorage.setItem("comparisonList", JSON.stringify(comparisonList));
  updateComparisonSection();
}

function updateSorting() {
    const selectedOption = sortOption.value;

    if (selectedOption === "market_cap") {
        cryptoData.sort((a, b) => b.market_cap - a.market_cap);
    } else if (selectedOption === "price") {
        cryptoData.sort((a, b) => b.current_price - a.current_price);
    } else if (selectedOption === "24h_change") {
        cryptoData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    }

    displayCryptoList(cryptoData);
}
sortOption.addEventListener('change', updateSorting);


function addToFavorites(cryptoId, name, symbol, currentPrice, priceChange, marketCap) {
  // Check if the favorite is already added
  if (!favorites.some((fav) => fav.id === cryptoId)) {
    const favoriteData = { 
      id: cryptoId, 
      name: name, 
      symbol: symbol, 
      current_price: currentPrice, 
      price_change_percentage_24h: priceChange, 
      market_cap: marketCap
    };
    favorites.push(favoriteData);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesSection();
  }
}

function updateFavoritesSection() {
  favoritesContainer.innerHTML = "";
  favorites.forEach((fav) => {
    const card = document.createElement("div");
    card.classList.add("favorite-card");
    card.innerHTML = `
      <h3>${fav.name} (${fav.symbol.toUpperCase()})</h3>
      <p>Price: $${fav.current_price.toFixed(2)}</p>
      <p>24H Change: ${fav.price_change_percentage_24h.toFixed(2)}%</p>
      <p>Market Cap: $${fav.market_cap.toLocaleString()}</p>
      <button onclick="removeFromFavorites('${fav.id}')">Remove</button>
    `;
    favoritesContainer.appendChild(card);
  });
}

function removeFromFavorites(cryptoId) {
  favorites = favorites.filter((fav) => fav.id !== cryptoId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesSection();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCryptoData();
  updateComparisonSection();
  updateFavoritesSection();
});
