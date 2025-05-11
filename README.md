# StockTracker - Financial Market Analysis Application

A comprehensive stock market analysis application built with AJAX, Angular, Node.js, and MongoDB, providing real-time stock data, portfolio management, and watchlist functionality.
## Live Demo
[View Live Demo](https://shraddhaassignment3webtechnology-idpstnzwpq-uw.a.run.app/search/home)
## Project Overview

StockTracker is a full-stack web application that allows users to:

- Search for stocks using ticker symbols with autocomplete functionality
- View detailed stock information including price, company data, and market status
- Analyze stocks using interactive charts and visualizations
- Track latest news for selected companies
- Create and manage personal watchlists
- Simulate buying and selling stocks with portfolio tracking

## Technology Stack

### Frontend
- Angular (v17.3.0) with Angular Material components
- Bootstrap for responsive design
- Highcharts for interactive data visualization
- TypeScript, HTML5, CSS3

### Backend
- Node.js with Express
- MongoDB Atlas for database storage
- RESTful API architecture

### APIs
- Finnhub API for stock information, news, and financial metrics
- Polygon.io API for historical market data
- Social sharing integrations (Twitter/X, Facebook)

## Key Features

### Stock Search
- Search for stock information using ticker symbols
- Autocomplete for efficient stock discovery
- Detailed company information and current market data

### Interactive Data Visualization
- Real-time and historical stock price charts
- Volume analysis with SMA and Volume by Price indicators
- Recommendation trend visualization
- EPS surprises analysis

### Watchlist Management
- Add/remove stocks to personal watchlist
- At-a-glance view of current prices and performance

### Portfolio Simulation
- Initial $25,000 wallet balance for simulated trading
- Buy and sell stocks at current market prices
- Track portfolio performance and profit/loss
- Transaction history and statistics

### Mobile Responsive
- Fully responsive design for mobile and desktop devices

## Project Structure

```
StockTracker/
├── src/
│   ├── app/
│   │   ├── buymodal/          # Buy stock modal component
│   │   ├── home/              # Home and search component
│   │   ├── newscardmodal/     # News modal component
│   │   ├── portfolio/         # Portfolio management component
│   │   ├── sellmodal/         # Sell stock modal component
│   │   ├── watchlist/         # Watchlist component
│   │   ├── app.component.html # Main app template
│   │   ├── app.component.ts   # Main app logic
│   │   ├── app.config.ts      # App configuration
│   │   └── app.routes.ts      # Routing configuration
│   ├── custom-theme.scss      # Custom theme styling
│   ├── index.html             # Main HTML entry
│   ├── main.ts                # Main TypeScript entry
│   └── styles.css             # Global styles
├── index.js                   # Node.js backend server
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## Installation and Setup

### Prerequisites
- Node.js (v18+)
- Angular CLI
- MongoDB Atlas account
- API keys for Finnhub and Polygon.io

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/StockTracker.git
   cd StockTracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file with your API keys and MongoDB connection string

4. Run the application:
   ```
   npm start
   ```

5. Navigate to http://localhost:4200 in your browser

## MongoDB Setup

The application requires MongoDB Atlas for storing:
- User watchlist data
- Portfolio information
- Wallet balance

Three collections need to be created:
- `watchlist`: Stores stocks added to watchlist
- `buysell`: Stores portfolio transaction data
- `walletamount`: Stores user's remaining funds

## API Routes

The backend server provides several endpoints:
- `/autocomplete` - For stock symbol autocomplete
- `/companydetailsone` - For company profile information
- `/companydetailstwo` - For latest stock quotes
- `/companypeers` - For related company information
- `/hourchart`, `/charttab` - For chart data
- `/insighttab`, `/insighttrends`, `/insighteps` - For analytical insights
- `/newstab` - For company news
- `/watchlist` operations - For managing watchlist
- `/buysellstocks` operations - For portfolio transactions
- `/walletamount` - For wallet balance management

## Deployment

The application can be deployed to:
- Google Cloud App Engine
- AWS Elastic Beanstalk
- Microsoft Azure App Service

## Credits

- [Finnhub](https://finnhub.io/) for financial data API
- [Polygon.io](https://polygon.io/) for historical stock data
- [Highcharts](https://www.highcharts.com/) for interactive data visualization
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database services
