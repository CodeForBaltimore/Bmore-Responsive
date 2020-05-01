import chai from 'chai';
import utils from '../utils';
import { Login } from '../utils/login';

const { expect, assert } = chai;

describe('Utils Tests', () => {
    it('should return 00:00:01', done => {
        expect(utils.formatTime(1)).to.equal('00:00:01');
        done();
    });
});

describe('Utils Login Tests', () => {
    it('should be an instance of Login', async done => {
        expect(new Login()).to.be.an.instanceof(Login);
        done();
    });
    // it('should return an token', async () => {
    //     const authed = new Login();
    //     await authed.setToken();
    //     const token = authed.getToken();
        
    //     assert.exists(token);
    // });
    // it('should not return an token', async () => {
    //     const authed = new Login();
    //     await authed.setToken();
    //     const token = await authed.destroyToken();
        
    //     expect(token).to.include('deleted');
    // });
});