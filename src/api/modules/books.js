import api from '../';

export default {
    list(page, size, success, failure) {
        // const data = {
        //     query: 'query { books { rows { url pages { image } } page pageSize totalPages } }'
        // }
        // return api.get('/api/v1/books', {
        return api.get('/api/v1/archives', {
            headers: {
                'Content-Type': 'application/json'
            // },
            // params: {
            //     page: page,
            //     pageSize: size
            }
        });
    },
    get(urn, success, failure) {
        return api.get('/api/v1/books/', {
            params: {
                urn: urn
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
