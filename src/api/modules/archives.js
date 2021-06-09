import api from '../';
import { graphql } from '../';

export default {
    list(directory, page = 1, pageSize = 10) {
        return graphql.post('/', {
          query: `
            {
              browse(
                directory: "${directory}"
                page: ${page}
                pageSize: ${pageSize}
              ){
                rows{
                  name
                  type
                }
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
