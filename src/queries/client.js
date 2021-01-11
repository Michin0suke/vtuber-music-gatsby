import { ApolloClient, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

export const client = new ApolloClient({
  uri: new HttpLink({ uri: 'https://api.vtuber-music.com/graphql', fetch }),
  // uri: 'https://api.vtuber-music.com/graphql',
  // uri: 'http://vtuber-music.test/graphql',
  cache: new InMemoryCache()
});

