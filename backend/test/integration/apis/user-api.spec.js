const request = require('supertest');
const { app, initialized} = require('../../../src/app');
const userService = require('../../../src/services/user-service');
const {handleResponse} = require("../support/supertestResponseHandler");
const {normalTestUser, adminTestUser} = require("../support/testUsers");

describe('user-api integration tests',() => {
    beforeAll(async () => {
        await initialized;                                                      // wait for the backend to be fully initialized
        await userService.add(app.get('db'), normalTestUser);                   // set up test users
    });

    afterAll(async () => {
        await userService.remove(app.get('db'), normalTestUser.username);       // remove test users
    });

    describe('GET /api/user', () => {
        it('expect user-info to reflect the user that is currently logged in', (done) => {
            const agent = request.agent(app); //use agent to preserve a session
            agent.post('/api/login')
                .send({
                    username: normalTestUser.username,
                    password: normalTestUser.password
                })
                .end((loginError) => {
                    if (loginError) return done(new Error('endpoint could not be tested! Failed to log in for preparation.'));
                    agent.get('/api/user')
                        .expect(200) // response status must be 200
                        .expect((response) => {
                            if(response.body.email !== normalTestUser.email) throw new Error('response does not contain the email address of the authenticated user');
                            if(response.body.firstname !== normalTestUser.firstname) throw new Error('response does not contain the firstname of the authenticated user');
                            if(response.body.lastname !== normalTestUser.lastname) throw new Error('response does not contain the lastname of the authenticated user');
                            if(response.body.isAdmin !== normalTestUser.isAdmin) throw new Error('response does not contain the admin privileges of the authenticated user');
                            if(response.body.username !== normalTestUser.username) throw new Error('response does not contain the username of the authenticated user');
                        })
                        .end(handleResponse(done));
                });
        });

        it('expect user-info to fail if the user has not been authenticated', (done) => {
            request(app)
                .get('/api/user')
                .send()
                .expect(401) // response status must be 200
                .end(handleResponse(done));
        });
    });
});
