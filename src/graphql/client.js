import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
// helpers
import { getAuthToken, getAuthUser } from 'helpers/storage';
import { storeDataVar } from 'helpers/cache';

const baseurl =
  process.env.NODE_ENV === 'development'
    ? 'http://tennissquad.local.tst/tennis/ci/index.php/graphql'
    : '/tennis/ci/index.php/graphql';

const httpLink = createHttpLink({
  uri: baseurl,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getAuthToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const mergeCache = {
  keyArgs: false,
  merge(existing, incoming) {
    return incoming;
  },
};
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentMemberId: {
          read() {
            return getAuthUser().id;
          },
        },
        currentStoreId: {
          read() {
            return storeDataVar().id;
          },
        },
        currentStoreKey: {
          read() {
            return storeDataVar().key;
          },
        },
        clt_bookings: mergeCache,
        clt_payments: mergeCache,
      },
    },
  },
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

export default client;
