import api from '../';
import { graphql } from '../';

export default {
    browse(directory = '', page = 1, pageSize = 10) {
        return graphql.post('/', {
          query: `
            {
              browse(
                directory: "${directory}"
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
