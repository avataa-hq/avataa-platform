import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './1_app/App';
import { Providers } from './1_app/Providers';
import './index.css';

const root = createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
  <Providers>
    <App />
  </Providers>,
);

reportWebVitals();
