import axios from 'axios';
import getEnv from '../utils/env';

const graphqlConfig = {
  protocol: window.location.protocol,
  host: getEnv('GRAPHQL_GATEWAY_HOST'),
  cacheTTL: getEnv('GRAPHQL_CACHE_TTL')
};

const graphql = axios.create({
  baseURL: graphqlConfig.protocol + '//' + graphqlConfig.host + '/',
  headers: {
    'Cache-Control': graphqlConfig.cacheTTL === '0' ? `no-cache`: `public, max-age=${graphqlConfig.cacheTTL}`
  }
  // timeout: 1000
});

export default {
    browse(directory = '', page = 1, pageSize = 10, abortController = new AbortController()) {
        return graphql.post('/', {
          signal: abortController.signal,
          query: `
            {
              browse(
                directory: "${directory}"
                page: ${page}
                pageSize: ${pageSize}
              ){
                rows { urn name type cover info { series number summary writer coverArtist penciller } }
                total
                totalPages
                page
                pageSize
              }
            }
          `
        });
    },
    read(urn) {
        return graphql.post('/', {
          query: `
            {
              read(
                book: "${urn}"
              ){
                rows { image }
              }
            }
          `
        });
    },
    search(query = '', page = 1, pageSize = 10, abortController = new AbortController()) {
        return graphql.post('/', {
          signal: abortController.signal,
          query: `
            {
              search(
                query: "${query}"
                page: ${page}
                pageSize: ${pageSize}
              ){
                rows { urn name type cover info { series number summary } }
                total
                totalPages
                page
                pageSize
              }
            }
          `
        });
    }
};
