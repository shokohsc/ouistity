import { graphql } from '../';

export default {
    search(q = '', page = 1, pageSize = 10) {
        return graphql.post('/', {
          query: `
            {
              search(
                query: "${q}"
                page: ${page}
                pageSize: ${pageSize}
              ){
                rows { urn name type cover }
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
