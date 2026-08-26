const request = require('supertest');
const { app, initialized} = require('../../src/app');
const userService = require('../../src/services/user-service');
const User = require("../../src/models/User");
const { cookies} = require("supertest");
const {handleResponse} = require("../util/supertestResponseHandler");

const adminTestUser = new User(
    'integrationtest_janeSmith',
    'Jane',
    'Smith',
    'js@example.org',
    'drowssaptercesrepus',
    true
);

const normalTestUser = new User(
    'integrationtest_johnDoe',
    'John',
    'Doe',
    'jd@example.org',
    'supersecretpassword',
    false
);

describe('auth-api integration tests',() => {
    before('wait for the backend to be fully initialized', async () => await initialized);

    before('set up test users', async () => {
        await userService.add(app.get('db'), adminTestUser);
        await userService.add(app.get('db'), normalTestUser);
    });

    after('remove test users', async () => {
        await userService.remove(app.get('db'), adminTestUser.username);
        await userService.remove(app.get('db'), normalTestUser.username);
    });

    describe('POST /api/login', () => {
        it('expect a positive response and cookies, when authenticating with correct credentials', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    username: normalTestUser.username,
                    password: normalTestUser.password
                })
                .expect(200) // response status must be 200
                .expect(cookies.set({name: 'session'})) // cookie 'session' must be set
                .expect(cookies.set({name: 'session.sig'})) // cookie 'session.sig' must be set
                .end(handleResponse(done));
        });

        it('expect an error response when authenticating with a wrong password', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    username: normalTestUser.username,
                    password: 'wrongpassword'
                })
                .expect(401) // response status must be 401
                .expect(cookies.not('set', {name: 'session'})) // cookie 'session' must not be set
                .expect(cookies.not('set', {name: 'session.sig'})) // cookie 'session.sig' must not be set
                .end(handleResponse(done));
        });

        it('expect an error response when authenticating with an unknown username', (done) => {
            request(app)
                .post('/api/login')
                .send({
                    username: 'integrationtest_unknownUser',
                    password: normalTestUser.password
                })
                .expect(401) // response status must be 401
                .expect(cookies.not('set', {name: 'session'})) // cookie 'session' must not be set
                .expect(cookies.not('set', {name: 'session.sig'})) // cookie 'session.sig' must not be set
                .end(handleResponse(done));
        });
    });
});
