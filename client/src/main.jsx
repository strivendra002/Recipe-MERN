import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App'
import { AuthProvider } from './context/AuthContext'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bgImage: "url('https://st2.depositphotos.com/3300441/6319/i/450/depositphotos_63197527-stock-photo-baking-background-with-blank-cook.jpg')",
        bgSize: "cover",
        bgPosition: "center",
        bgRepeat: "no-repeat",
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
    
  </StrictMode>,
  </ChakraProvider>
)
