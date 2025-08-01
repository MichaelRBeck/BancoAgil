import React from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '@/redux/store';

import '@/styles/globals.css'; 

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  );
}

export default MyApp;
