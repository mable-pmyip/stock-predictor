import { useState } from 'react'
import styled from 'styled-components'
import OpenAI from 'openai'
import { format, subDays } from 'date-fns'
import ReactMarkdown from 'react-markdown'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`

const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
`

const StyledInput = styled.input`
  padding: 0.75rem;
  font-size: 1.2rem;
  width: 300px;
  text-transform: uppercase;
`

const AddButton = styled.button<{ $disabled: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 1.5rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
`

const TickersContainer = styled.div`
  margin-top: 2rem;
  min-height: 100px;
`

const TickerItem = styled.div`
  font-size: 1.5rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

const RemoveButton = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
`

const GenerateButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #4ade80;
  border: none;
  cursor: pointer;
  font-weight: bold;
`

const FooterText = styled.p<{ $marginTop?: string }>`
  margin-top: ${props => props.$marginTop || '0'};
  font-size: 0.9rem;
`

const ReportSection = styled.div`
  margin-top: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const ReportTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`

const ReportContainer = styled.div`
  padding: 2rem;
  background-color: #1a1a1a;
  border: 3px solid #4ade80;
  border-radius: 8px;
  text-align: left;
  line-height: 1.8;
  color: #e5e5e5;
  font-size: 1.1rem;

  h1, h2, h3, h4, h5, h6 {
    color: #4ade80;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.3rem;
  }

  p {
    margin-bottom: 1rem;
  }

  strong {
    color: #fff;
    font-weight: 600;
  }

  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  code {
    background-color: #2a2a2a;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }
`

function App() {
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

  const handleGenerateReport = async () => {
    setLoading(true)
    setReport(null)
    try {
      // Calculate date range (last 30 days)
      const endDate = format(new Date(), 'yyyy-MM-dd')
      const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd')

      // Fetch stock data from Polygon API for each ticker
      const stockData = await Promise.all(stockTickers.map(async (ticker) => {
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=${POLYGON_API_KEY}`
        const response = await fetch(url)
        const status = response.status

        if (status === 200) {
          const data = await response.text()
          return data
        } else {
          throw new Error(`Failed to fetch data for ${ticker}`)
        }
      }))

      // Send stock data to OpenAI for analysis
      const client = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      })

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a financial analyst AI assistant. Analyze the provided stock data and generate a comprehensive stock prediction report within 100 words"
          },
          {
            role: "user",
            content: `Here is the stock data for ${stockTickers.join(', ')} for the last 30 days:\n\n${stockData.join('\n\n')}\n\nPlease provide a detailed analysis and prediction for these stocks.`
          }
        ]
      });

      setReport(response.choices[0].message.content)
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

export default App
