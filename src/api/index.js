import axios from 'axios';
import books from './modules/books'
import pages from './modules/pages'

const config = {
  protocol: "https",
  host: 'api' + '.' + window.location.hostname,
  port: "443"
};
const api = axios.create({
  baseURL: config.protocol + '://' + config.host + ':' + config.port + '/'
  // timeout: 500
});

export {
    books as books,
    pages as pages,
    api as default
}
