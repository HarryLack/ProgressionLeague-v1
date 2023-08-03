import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import App from './App';
import './index.css';
import { store } from './store/store';
import pkg from '../package.json';
import { BanlistHandler } from './handlers/banlistHandler';

console.log('Progression League: version', pkg.version);
const elm = document.createElement('div');
elm.setAttribute('id', 'root');
document.body.append(elm);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
);

// @ts-ignore
window.Banlist = BanlistHandler;
