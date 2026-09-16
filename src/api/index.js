import axios from 'axios';

const graphqlConfig = {
  protocol: window.location.protocol,
  cacheTTL: '600'
};

const graphql = axios.create({
  baseURL: `${window.location.protocol}//apollo.${window.location.hostname}:${window.location.port}/`,
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
                rows { name type cover info { series number summary writer coverArtist penciller } }
                total
                totalPages
                page
                pageSize
              }
            }
          `
        });
    },
    read(book) {
        return graphql.post('/', {
          query: `
            {
              read(
                book: "${book}"
              ){
                rows { image, name }
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
                rows { name type cover path info { series number summary } }
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
