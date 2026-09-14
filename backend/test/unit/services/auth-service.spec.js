const authService = require('../../../src/services/auth-service');
const User = require("../../../src/models/User");
const {copyObject} = require("../support/copyObject");

const demouser = new User('testuser', 'John', 'Doe', 'jd@test.com', 'secret', false);

describe('auth-service unit-tests', function (){
    describe('auth session test', function (){
        it('user stored in session', function (){
            const session = {};
            authService.authenticate(session, demouser);

            const expected = copyObject(demouser);
            expected._id = undefined;        // ignore _id

            expect(session.user).toEqual(expected);
        });

        it('session marked as authenticated', function (){
            const session = {};
            authService.authenticate(session, demouser);
            expect(session.authenticated).toBe(true);
        });
    });

    describe('auth state check test', function (){
        it('true if session is marked as authenticated', function (){
            const session = {authenticated: true};
            expect(authService.isAuthenticated(session)).toBe(true);
        });

        it('false if session is marked as not authenticated', function (){
            const session = {authenticated: false};
            expect(authService.isAuthenticated(session)).toBe(false);
        });

        it('false if session is not marked', function (){
            const session = {};
            expect(authService.isAuthenticated(session)).toBe(false);
        });
    });

    describe('auth state reset test', function (){
        it('reset session to null', function (){
            let session = {
                authenticated: true,
                user: demouser
            };
            authService.deAuthenticate(session);
            expect(session.authenticated).not.toBeTruthy();
            expect([undefined, null]).toContain(session.user);
        });
    });
});
