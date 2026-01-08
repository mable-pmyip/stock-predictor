# Kuma's Stock Predictions 📈

An AI-powered stock analysis application that generates detailed prediction reports for up to 3 stock tickers using real-time market data and OpenAI's GPT-4.

## Features

- 📊 **Real-Time Stock Data**: Fetches 30-day historical stock data via Polygon API
- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT-4 to generate comprehensive stock predictions and insights
- 🎯 **Multi-Ticker Support**: Analyze up to 3 stock tickers simultaneously
- 🌓 **Theme Toggle**: Switch between light and dark modes
- 📱 **Responsive Design**: Beautiful UI built with Styled Components
- 🐻 **Easter Egg**: Hover over the logo to meet Kuma!

## How It Works

1. **Enter Stock Tickers**: Add up to 3 stock ticker symbols (e.g., AAPL, GOOGL, MSFT)
2. **Generate Report**: Click the "Generate Report" button
3. **Get AI Analysis**: The app fetches the last 30 days of stock data and generates an AI-powered analysis report with predictions

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Styled Components
- **APIs**: 
  - Polygon API (stock market data)
  - OpenAI GPT-4 (AI analysis)
- **Backend**: Cloudflare Workers
  - `polygon-api-worker`: Fetches stock data
  - `openai-api-worker`: Processes AI predictions
- **Date Handling**: date-fns
- **Markdown Rendering**: react-markdown

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a stock ticker symbol (e.g., AAPL, TSLA, GOOGL)
2. Press Enter or click the + button to add it
3. Add up to 3 tickers
4. Click "GENERATE REPORT" to get AI-powered predictions
5. Review the detailed analysis report with market insights

## Important Note

⚠️ **This is not real financial advice!** This app is for educational and entertainment purposes only. Always do your own research and consult with financial professionals before making investment decisions.

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Deployment

This app is designed to be deployed on Cloudflare Pages:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Cloudflare Pages

## License

MIT

## Author

Built with ❤️ by Kuma (and friends)
