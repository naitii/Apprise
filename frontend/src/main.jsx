import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'


const styles = {
  global:(props)=>({
    body:{
      color:mode('gray.800','white')(props),
      bg:mode('gray.100','#1e1e1e')(props),
    }
  })
}
const config = {
  initialColorMode:'dark',
  useSystemColorMode:true,
}

const colors = {
  gray: {
    light: "#616161",
    dark: "#000000",
  },
  outline: {
    light: "#0cbf06",
    dark: "#9c7945",
  },
};

const theme = extendTheme({colors, config, styles});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
