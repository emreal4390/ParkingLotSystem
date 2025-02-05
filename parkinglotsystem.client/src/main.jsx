import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

// ✅ UTF-8 Desteğini Ekleyelim
const setUTF8Encoding = () => {
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "UTF-8");
    document.head.appendChild(meta);
};

// ✅ React başlamadan önce UTF-8 kodlamasını ayarla
setUTF8Encoding();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
