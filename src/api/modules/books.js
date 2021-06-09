import api from '../';

export default {
    get(urn, success, failure) {
        return api.get('/api/v1/books/', {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                urn: urn
            }
        });
    }
};
