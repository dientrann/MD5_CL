import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './stores/index.ts'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store = {store}>
    <App />
  </Provider>
)
