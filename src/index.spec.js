import chai from 'chai';
import request from 'supertest';
import app from '.';
import utils from './utils';

const {expect} = chai;

describe('API Integration Tests', () => {
	it('should return uptime', done => {
		request(app)
			.get('/_healthcheck')
			.end((err, res) => {
				if (err) {
					console.error(`IT uptime error: ${err}`);
				}

				expect(res.body.uptime).to.be.ok;
				expect(res.statusCode).to.equal(200);
				done();
			});
	});
	it('should return environment', done => {
		request(app)
			.get('/_healthcheck')
			.end((err, res) => {
				if (err) {
					console.error(`IT environment error: ${err}`);
				}

				expect(res.body.environment).to.be.ok;
				expect(res.statusCode).to.equal(200);
				done();
			});
	});
	it('should return version number', done => {
		request(app)
			.get('/_healthcheck')
			.end((err, res) => {
				if (err) {
					console.error(`IT version error: ${err}`);
				}

				expect(res.body.version).to.be.ok;
				expect(res.statusCode).to.equal(200);
				done();
			});
	});
	it('should return request id', done => {
		request(app)
			.get('/_healthcheck')
			.end((err, res) => {
				if (err) {
					console.error(`IT version error: ${err}`);
				}

				expect(res.body.requestId).to.be.ok;
				expect(res.statusCode).to.equal(200);
				done();
			});
	});
});

describe('Utils Tests', () => {
    it('formatTime', done => {
        expect(utils.formatTime(1)).to.equal('00:00:01');
        done();
    });
});
