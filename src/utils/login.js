// libraries
const chakram = require('chakram');
const { describe, it } = require('mocha');

const { expect } = chakram; // use the chakram expectation
const { serviceUrl, login } = require('../data/config');

/**
 * Login to the API to get a JWT token.
 */
module.exports = async () => {
    // get token response from api
    const response = await chakram.post(`${serviceUrl}/login`, login);

    describe('logging in', () => {
        it('should have 200 response',
            () => expect(response).to.have.status(200));

        it('should have token property',
            () => expect(response.body).to.have.property('token'));
    });

    return response.body.token; // return the api token
};
