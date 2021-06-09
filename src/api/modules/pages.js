import api from '../';

export default {
    get(urn, success, failure) {
        return api.get('/api/v1/pages/', {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                urn: urn
            }
        });
    }
};
