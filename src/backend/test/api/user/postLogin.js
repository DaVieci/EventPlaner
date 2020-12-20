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

    it('OK: login test with test@mail.com', (done) => {
        request(app).post('/users/login')
            .send({ email: 'test@mail.com', password: '1234' })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('token');
                done();
            })
            .catch(err => done(err));
    })

    it('OK:login test with wrong password', (done) => {
        request(app).post('/users/login')
            .send({ email: 'test@mail.com', password: '12345' })
            .then((res) => {
                const body = res.text;
                expect(body).to.equal('not allowed');
                done();
            })
            .catch(err => done(err));
    })
})