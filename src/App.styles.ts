import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
  text-align: center;
`

export const InputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
`

export const StyledInput = styled.input`
  padding: 0.75rem;
  font-size: 1.2rem;
  width: 300px;
  text-transform: uppercase;
`

export const AddButton = styled.button<{ $disabled: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 1.5rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
`

export const TickersContainer = styled.div`
  margin-top: 2rem;
  min-height: 100px;
`

export const TickerItem = styled.div`
  font-size: 1.5rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

export const RemoveButton = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
`

export const GenerateButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #4ade80;
  border: none;
  cursor: pointer;
  font-weight: bold;
`

export const FooterText = styled.p<{ $marginTop?: string }>`
  margin-top: ${props => props.$marginTop || '0'};
  font-size: 0.9rem;
`

export const ReportSection = styled.div`
  margin-top: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

export const ReportTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`

export const ReportContainer = styled.div`
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
