const request = require('supertest');
const { app, initialized} = require('../../../src/app');
const userService = require('../../../src/services/user-service');
const {handleResponse} = require("../support/supertestResponseHandler");
const {normalTestUser, adminTestUser} = require("../support/testUsers");
const peopleDemoService = require("../../../src/services/people-demo-service");
const {expect: chaiExpect} = require("chai");

describe('user-api integration tests',() => {
    before('wait for the backend to be fully initialized', async () => await initialized);

    before('set up test users', async () => {
        await userService.add(app.get('db'), normalTestUser);
    });

    after('remove test users', async () => {
        await userService.remove(app.get('db'), normalTestUser.username);
    });

    describe('GET /api/user', () => {
        it('expect people-demo to return the predefined data if the user that is currently logged in', async () => {
            const agent = request.agent(app); //use agent to preserve a session
            const expectedResponse = await peopleDemoService.getPeople()

            await agent.post('/api/login')
                .send({
                    username: normalTestUser.username,
                    password: normalTestUser.password
                });

            return  agent.get('/api/people')
                .expect(200) // response status must be 200
                .expect((response) =>  {
                    chaiExpect(response.body).to.be.eql(expectedResponse);
                });
        });

        it('expect people-demo to fail if the user has not been authenticated', (done) => {
            request(app)
                .get('/api/people')
                .send()
                .expect(401) // response status must be 200
                .end(handleResponse(done));
        });
    });
});
