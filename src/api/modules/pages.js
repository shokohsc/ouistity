import api from '../';

export default {
    get(urn, success, failure) {
        return api.get('/api/v1/pages/', {
            params: {
                urn: urn
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
