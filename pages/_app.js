import React from 'react';
import {WindowProvider} from '../components/hooks/WindowcontextAPI.js';

const App = ({ Component, pageProps }) => (
  <WindowProvider>
    <Component {...pageProps} />
  </WindowProvider>
);

export default App;
