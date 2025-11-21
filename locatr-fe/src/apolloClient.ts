import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN } from './graphql/mutations/auth';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
  credentials: 'include', // Important: sends cookies with requests
});

// Error handling link for automatic token refresh
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // Check if error is due to expired access token
      if (err.message.includes('Unauthorized') || err.message.includes('jwt expired')) {
        // Try to refresh the token
        return new Promise((resolve) => {
          client
            .mutate({
              mutation: REFRESH_TOKEN,
            })
            .then(() => {
              // Token refreshed successfully, retry the original request
              resolve(forward(operation));
            })
            .catch(() => {
              // Refresh failed, user needs to login again
              console.log('Token refresh failed, please login again');
              // Optionally redirect to login page
              window.location.href = '/login';
              resolve(forward(operation));
            });
        });
      }
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
