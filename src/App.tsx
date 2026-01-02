import { useState } from 'react'
import styled from 'styled-components'

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

function App() {
  const [inputValue, setInputValue] = useState('')
  const [stockTickers, setStockTickers] = useState<string[]>([])

  const handleAddTicker = () => {
    if (inputValue.trim() && stockTickers.length < 3) {
      setStockTickers([...stockTickers, inputValue.trim().toUpperCase()])
      setInputValue('')
    }
  }

  const handleRemoveTicker = (index: number) => {
    setStockTickers(stockTickers.filter((_, i) => i !== index))
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
        <GenerateButton>
          GENERATE REPORT
        </GenerateButton>
      )}

      <FooterText $marginTop="3rem">
        Always correct 15% of the time!
      </FooterText>
      <FooterText>
        © This is not real financial advice!
      </FooterText>
    </Container>
  )
}

export default App
