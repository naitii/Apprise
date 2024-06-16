import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'


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
    <RecoilRoot>
      <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SocketContextProvider>
        <App />

        </SocketContextProvider>
      </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
