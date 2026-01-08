import { useState } from 'react'
import { format, subDays } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { ThemeProvider } from 'styled-components'
import Switch from 'react-switch'
import {
  GlobalStyle,
  AppWrapper,
  Header,
  GitHubLink,
  ThemeToggleWrapper,
  Container,
  Logo,
  Title,
  Subtitle,
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
    const url = `https://polygon-api-worker.mable-pmyip.workers.dev/?ticker=${ticker}&startDate=${startDate}&&endDate=${endDate}`
    
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker} from polygon api worker. Status: ${response.status} ${response.statusText}.`)
    }

    return response.text()
  }

  const analyzeWithAI = async (tickers: string[], stockData: string[]) => {
    const url = 'https://openai-api-worker.mable-pmyip.workers.dev/stock-predictor'
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
        <Header>
          <GitHubLink
            href="https://github.com/mable-pmyip/stock-predictor"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </GitHubLink>
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
        </Header>

        <Container>
          <Logo
            src={isHovered ? myKuma : myLogo}
            alt="Logo"
            width="200"
            height="200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          <Title>Kuma's Stock Predictions</Title>
          <Subtitle>Add up to 3 stock tickers below to get a super accurate stock predictions report 👇</Subtitle>

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
