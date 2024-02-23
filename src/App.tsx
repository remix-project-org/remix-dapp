import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { IntlProvider } from 'react-intl';
import { useAppSelector } from './redux/hooks';
import enJson from './locales/en';
import zhJson from './locales/zh';
import esJson from './locales/es';
import frJson from './locales/fr';
import itJson from './locales/it';

const localeMap: Record<string, any> = {
  zh: zhJson,
  en: enJson,
  fr: frJson,
  it: itJson,
  es: esJson,
};

function App(): JSX.Element {
  const selectedLocaleCode = useAppSelector(
    (state) => state.settings.selectedLocaleCode
  );
  return (
    <IntlProvider
      locale={selectedLocaleCode}
      messages={localeMap[selectedLocaleCode]}
    >
      <RouterProvider router={router} />
    </IntlProvider>
  );
}

export default App;
