import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {ChakraProvider} from '@chakra-ui/react'
import {extendTheme} from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    primary: {
      main: '#7bb9e8',
    },
    secondary: {
      main: '#eb7f7f',
    },
  },
  styles: {
    global: {
      'html, body': {
        color: 'black',
      },
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
