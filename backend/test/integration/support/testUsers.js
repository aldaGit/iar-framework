const User = require("../../../src/models/User");

const adminTestUser = new User(
    'integrationtest_janeSmith',
    'Jane',
    'Smith',
    'js@example.org',
    'drowssaptercesrepus',
    true
);

exports.adminTestUser = adminTestUser;

const normalTestUser = new User(
    'integrationtest_johnDoe',
    'John',
    'Doe',
    'jd@example.org',
    'supersecretpassword',
    false
);

exports.normalTestUser = normalTestUser;
