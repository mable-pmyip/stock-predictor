import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
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

export const AppWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
`

export const Header = styled.header`
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.body};
  transition: all 0.3s ease;
`

export const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  color: ${props => props.theme.text};
  text-decoration: none;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    opacity: 0.8;
  }
`

export const ThemeToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
`

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.text};
`

export const Logo = styled.img`
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
`

export const Title = styled.h1`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  margin-bottom: 0;
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
  background-color: ${props => props.theme.inputBg};
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.inputBorder};
  border-radius: 4px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`

export const AddButton = styled.button<{ $disabled: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 1.5rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.border};
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
  }
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
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ef4444;
    color: white;
  }
`

export const GenerateButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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
  background-color: ${props => props.theme.reportBg};
  border: 3px solid ${props => props.theme.reportBorder};
  border-radius: 8px;
  text-align: left;
  line-height: 1.8;
  color: ${props => props.theme.reportText};
  font-size: 1.1rem;
  transition: all 0.3s ease;

  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.headingColor};
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
    color: ${props => props.theme.strongColor};
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
    background-color: ${props => props.theme.codeBg};
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }
`
