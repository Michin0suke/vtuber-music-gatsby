import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://api.vtuber-music.com/graphql',
  // uri: 'http://vtuber-music.test/graphql',
  cache: new InMemoryCache()
});

