import { useState } from 'react'
import OpenAI from 'openai'
import { format, subDays } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import {
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

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY

export default function App() {
  const [inputValue, setInputValue] = useState('')
  const [stockTickers, setStockTickers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<string | null>(null)

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
    const client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst AI assistant. Analyze the provided stock data and generate a report advising on whether to buy or sell the shares based on the data that comes in as a parameter. within 100 words"
        },
        {
          role: "user",
          content: `Here is the stock data for ${tickers.join(', ')} for the last 30 days:\n\n${stockData.join('\n\n')}\n\nPlease provide a detailed analysis and prediction for these stocks.`
        }
      ]
    })

    return response.choices[0].message.content
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

  return (
    <Container>
      <h1>Dodgy Dave's Stock Predictions</h1>
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
  )
}
