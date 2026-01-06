import { useState } from 'react'
import { format, subDays } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import Switch from 'react-switch'
import {
  AppWrapper,
  ThemeToggleWrapper,
  Container,
  InputWrapper,
  StyledInput,
  AddButton,
  TickersContainer,
  TickerItem,
  RemoveButton,
  GenerateButton,
  FooterText,
  ReportSection,
  ReportTitle,
  ReportContainer
} from './App.styles'
import { lightTheme, darkTheme } from './theme'
import myLogo from '../public/app.svg'
import myKuma from '../public/kuma.png'

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

export default function App() {
  const [inputValue, setInputValue] = useState('')
  const [stockTickers, setStockTickers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddTicker = () => {
    if (inputValue.trim() && stockTickers.length < 3) {
      setStockTickers([...stockTickers, inputValue.trim().toUpperCase()])
      setInputValue('')
    }
  }

  const handleRemoveTicker = (index: number) => {
    setStockTickers(stockTickers.filter((_, i) => i !== index))
  }

  const fetchStockData = async (ticker: string, startDate: string, endDate: string) => {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=${POLYGON_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker}`)
    }

    return response.text()
  }

  const analyzeWithAI = async (tickers: string[], stockData: string[]) => {
    const url = 'https://openai-api-worker.mable-pmyip.workers.dev/analyze'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickers, stockData })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data from cloudflare worker')
    }

    return response.text()
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    setReport(null)

    try {
      const endDate = format(new Date(), 'yyyy-MM-dd')
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')

      const stockData = await Promise.all(
        stockTickers.map(ticker => fetchStockData(ticker, startDate, endDate))
      )

      const aiReport = await analyzeWithAI(stockTickers, stockData)
      setReport(aiReport)
    } catch (error) {
      console.error('Error generating report:', error)
      setReport('There was an error generating the report. Please check your API keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppWrapper>
        <ThemeToggleWrapper>
          <span>☀︎</span>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            onColor="#dcf1e4ff"
            offColor="#313333ff"
            checkedIcon={false}
            uncheckedIcon={false}
            height={24}
            width={48}
            handleDiameter={20}
          />
          <span>⏾</span>
        </ThemeToggleWrapper>

        <Container>
          <img
            src={isHovered ? myKuma : myLogo}
            alt="Logo"
            width="200"
            height="200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ cursor: 'pointer', transition: 'opacity 0.3s ease-in-out' }}
          />
          <h1>Kuma's Stock Predictions</h1>
          <p>Add up to 3 stock tickers below to get a super accurate stock predictions report 👇</p>

          <InputWrapper>
        <StyledInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTicker()}
          placeholder="Enter stock ticker"
          disabled={stockTickers.length >= 3}
        />
        <AddButton
          onClick={handleAddTicker}
          $disabled={stockTickers.length >= 3}
          disabled={stockTickers.length >= 3}
        >
          +
        </AddButton>
      </InputWrapper>

      <TickersContainer>
        {stockTickers.map((ticker, index) => (
          <TickerItem key={index}>
            <span>{ticker}</span>
            <RemoveButton onClick={() => handleRemoveTicker(index)}>
              Remove
            </RemoveButton>
          </TickerItem>
        ))}
      </TickersContainer>

      {stockTickers.length > 0 && (
        <GenerateButton onClick={handleGenerateReport} disabled={loading}>
          {loading ? 'GENERATING...' : 'GENERATE REPORT'}
        </GenerateButton>
      )}

      {report && (
        <ReportSection>
          <ReportTitle>Your Report 😜</ReportTitle>
          <ReportContainer>
            <ReactMarkdown>{report}</ReactMarkdown>
          </ReportContainer>
        </ReportSection>
      )}

      <FooterText $marginTop="3rem">
         © This is not real financial advice! 😉
      </FooterText>
        </Container>
      </AppWrapper>
    </ThemeProvider>
  )
}
