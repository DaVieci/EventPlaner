const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const conn = require('../../../database');

describe('POST /users/sign-up', () => {
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

    var userID = getTime();

    it('OK: signup test with test@mail.de', (done) => {
        request(app).post('/users/sign-up')
            .send({ fullName: 'Unittest User', email: 'test' + userID + '@unit.de', password: 'Unittest', confirmPassword: 'Unittest' })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('token');
                done();
            })
            .catch(err => done(err));
    })
})