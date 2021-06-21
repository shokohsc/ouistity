import axios from 'axios';
import folder from './modules/folder'
import book from './modules/book'
import query from './modules/query'

const graphqlConfig = {
  protocol: "https",
  host: 'apollo' + '.' + window.location.hostname,
  port: "443"
};

const graphql = axios.create({
  baseURL: graphqlConfig.protocol + '://' + graphqlConfig.host + ':' + graphqlConfig.port + '/'
  // timeout: 500
});

export {
    folder as folder,
    book as book,
    query as query,
    graphql as graphql
}
