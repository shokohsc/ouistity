import axios from 'axios';
import archives from './modules/archives'
import books from './modules/books'
import pages from './modules/pages'

const apiConfig = {
  protocol: "https",
  host: 'api' + '.' + window.location.hostname,
  port: "443"
};
const graphqlConfig = {
  protocol: "https",
  host: 'apollo' + '.' + window.location.hostname,
  port: "443"
};
const api = axios.create({
  baseURL: apiConfig.protocol + '://' + apiConfig.host + ':' + apiConfig.port + '/'
  // timeout: 500
});

const graphql = axios.create({
  baseURL: graphqlConfig.protocol + '://' + graphqlConfig.host + ':' + graphqlConfig.port + '/'
  // timeout: 500
});

export {
    archives as archives,
    books as books,
    pages as pages,
    api as default,
    graphql as graphql
}
