const request = require('supertest');
const { app, initialized} = require('../../../src/app');
const userService = require('../../../src/services/user-service');
const {handleResponse} = require("../support/supertestResponseHandler");
const {normalTestUser, adminTestUser} = require("../support/testUsers");
const peopleDemoService = require("../../../src/services/people-demo-service");

describe('user-api integration tests',() => {
    beforeAll(async () => {
        await initialized                                                   // wait for the backend to be fully initialized
        await userService.add(app.get('db'), normalTestUser);               // set up test users
    });

    afterAll(async () => {
        await userService.remove(app.get('db'), normalTestUser.username);   // remove test user
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
                    expect(response.body).toEqual(expectedResponse);
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
