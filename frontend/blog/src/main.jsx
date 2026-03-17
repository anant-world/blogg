import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import ThemeProvider from './components/ThemeProvider.jsx'
import store from './Redux/store'
import { Toaster } from 'sonner'
import { PersistGate } from 'redux-persist/integration/react'
import {persistStore} from 'redux-persist'


const persistor= persistStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
    <App />
    </ThemeProvider>
    <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
