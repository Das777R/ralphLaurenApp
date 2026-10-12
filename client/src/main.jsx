import { createRoot } from 'react-dom/client'
// import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import {UIProvider} from './context/UIProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <UIProvider>
    <App />
  </UIProvider>
  </BrowserRouter>  
)
