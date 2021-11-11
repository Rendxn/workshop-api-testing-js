const { expect } = require('chai');
const agent = require('superagent');

describe('when using query params in GET', () => {
  const baseUrl = 'https://api.github.com';
  describe('when not specifying pagination params to /users', () => {
    let users;
    before(async () => {
      ({ body: users } = await agent
        .get(`${baseUrl}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'superagent'));
    });

    it('then should have 30 users', () => {
      expect(users.length).to.equal(30);
    });

    describe('when specifying 10 per page to /users', () => {
      let tenUsers;
      before(async () => {
        ({ body: tenUsers } = await agent
          .get(`${baseUrl}/users`)
          .query({ per_page: 10 })
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'superagent'));
      });

      it('then should have 10 users', () => {
        expect(tenUsers.length).to.equal(10);
      });
    });

    describe('when specifying 50 per page to /users', () => {
      let fiftyUsers;
      before(async () => {
        ({ body: fiftyUsers } = await agent
          .get(`${baseUrl}/users`)
          .query({ per_page: 50 })
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'superagent'));
      });

      it('then should have 50 users', () => {
        expect(fiftyUsers.length).to.equal(50);
      });
    });
  });
});
