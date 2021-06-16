import api from '../';
import { graphql } from '../';

export default {
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
    }
};
