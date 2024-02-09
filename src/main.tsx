import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import zhJson from './locales/zh';
import App from './App';
import { store } from './redux/store';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <Provider store={store}>
    <IntlProvider locale="zh" messages={zhJson}>
      <App />
    </IntlProvider>
  </Provider>,
);
