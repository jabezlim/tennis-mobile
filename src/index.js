import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// graphql
import { ApolloProvider } from '@apollo/client';
import client from 'graphql/client';
// context
import { AppProvider } from './context';
// config
import { path } from 'config/path';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter basename={path.basename}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
