import chai from 'chai';
import utils from '../utils';

const {expect} = chai;

describe('Utils Tests', () => {
    it('should return 00:00:01', done => {
        expect(utils.formatTime(1)).to.equal('00:00:01');
        done();
    });
});