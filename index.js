<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypto Tracker</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Real-Time Cryptocurrency Tracker</h1>
        </header>

        <main>
            <!-- Cryptocurrency Listing -->
            <section id="crypto-list-section">
                <h2>Cryptocurrency Listing</h2>
                <div id="crypto-list"></div>
            </section>

            <!-- Comparison Section -->
            <section id="comparison-section">
                <h2>Compare Cryptocurrencies</h2>
                <div id="comparison-container"></div>
                <p id="comparison-message"></p>
            </section>

            <!-- User Preferences -->
            <section id="preferences-section">
                <h2>User Preferences</h2>
                <div>
                    <label for="sort-option">Sort by:</label>
                    <select id="sort-option">
                        <option value="market_cap">Market Cap</option>
                        <option value="price">Price</option>
                        <option value="24h_change">24H Change</option>
                    </select>
                </div>
                <div>
                    <label for="favorites">Favorite Cryptocurrencies:</label>
                    <ul id="favorites-list"></ul>
                </div>
            </section>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>
