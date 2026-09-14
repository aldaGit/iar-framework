const request = require('supertest');
const { app, initialized} = require('../../../src/app');
const userService = require('../../../src/services/user-service');
const { cookies} = require("supertest");
const {handleResponse} = require("../support/supertestResponseHandler");
const {adminTestUser, normalTestUser} = require("../support/testUsers");

describe('auth-api integration tests',() => {

    beforeAll(async () => {
        await initialized;                                                  // wait for the backend to be fully initialized
        await userService.add(app.get('db'), adminTestUser);                // set up test users
        await userService.add(app.get('db'), normalTestUser);
    });

    afterAll(async () => {
        await userService.remove(app.get('db'), adminTestUser.username);    // remove test users
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

    describe('DELETE /api/login', () => {
        it('expect a positive response and logging off, after being authenticated', (done) => {
            const agent = request.agent(app); //use agent to preserve a session
            agent.post('/api/login')
                .send({
                    username: normalTestUser.username,
                    password: normalTestUser.password
                })
                .end((loginError) => {
                    if (loginError) return done(new Error('Logoff could not be tested! Failed to log in for preparation.'));
                    agent.delete('/api/login')
                        .send()
                        .expect(200) // response status must be 200
                        .end((logoutError) => {
                            if (logoutError) return done(new Error('Logout failed!'));
                            agent.get('/api/user')
                                .expect(401) // user-endpoint should return error 401 if the user is not authenticated anymore -> response status must be 401
                                .end(handleResponse(done));
                        });
                });
        });

        it('expect logout to fail if the user has not been authenticated', (done) => {
            request(app)
                .delete('/api/login')
                .send()
                .expect(401) // response status must be 200
                .end(handleResponse(done));
        });
    });

    describe('GET /api/login', () => {
        it('expect body to reflect that the user is logged in', (done) => {
            const agent = request.agent(app); //use agent to preserve a session
            agent.post('/api/login')
                .send({
                    username: adminTestUser.username,
                    password: adminTestUser.password
                })
                .end((loginError) => {
                    if (loginError) return done(new Error('endpoint could not be tested! Failed to log in for preparation.'));
                    agent.get('/api/login')
                        .expect(200) // response status must be 200
                        .expect({loggedIn: true})
                        .end(handleResponse(done));
                });
        });

        it('expect body to reflect that the user is not logged in', (done) => {
            request(app)
                .get('/api/login')
                .expect(200) // response status must be 200
                .expect({loggedIn: false})
                .end(handleResponse(done));
        });
    });
});
