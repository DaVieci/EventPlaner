const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const conn = require('../../../database');

describe('POST /users/login', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch(err => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch(err => done(err));
    })

    it('OK: get events without token is rejected', (done) => {
        request(app).get('/events')
            .send()
            .then((res) => {
                const body = res.text;
                expect(body).to.equal('you dont have access');
                done();
            })
            .catch(err => done(err));
    })

    // it('OK: get events with wrong token is rejected', (done) => {
    //     request(app).get('/events')
    //     .send()
    //     .then((res) => {
    //         const body = res.text;
    //         expect(body).to.equal('token not valid');
    //         done();
    //     })
    //     .catch(err => done(err));
    // })
})