import axios from 'axios';
import archives from './modules/archives'
import pages from './modules/pages'

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
    archives as archives,
    pages as pages,
    graphql as graphql
}
