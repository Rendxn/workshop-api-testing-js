const agent = require('superagent');
const { expect, assert } = require('chai');
const { StatusCodes } = require('http-status-codes');

const baseUrl = 'https://api.github.com';
const username = 'aperdomob';

describe('Github user follow API test', () => {
  describe('when following user', () => {
    let followResponse;

    before(async () => {
      followResponse = await agent
        .put(`${baseUrl}/user/following/${username}`)
        .set('User-Agent', 'superagent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('should have an empty response', () => {
      expect(followResponse.status).to.equal(StatusCodes.NO_CONTENT);
      expect(followResponse.body).to.eql({});
    });

    describe('when fetching my followers', () => {
      let user;

      before(async () => {
        const response = await agent
          .get(`${baseUrl}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'superagent');

        user = response.body.find((list) => list.login === username);
      });

      it(`then should follow ${username}`, () => {
        assert.exists(user);
      });

      describe('when following user again', () => {
        let followResponseAgain;

        before(async () => {
          followResponseAgain = await agent
            .put(`${baseUrl}/user/following/${username}`)
            .set('User-Agent', 'superagent')
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('method is idempotent', () => {
          expect(followResponseAgain.status).to.equal(StatusCodes.NO_CONTENT);
          expect(followResponseAgain.body).to.eql({});
        });

        describe('when fetching my followers', () => {
          before(async () => {
            const response = await agent
              .get(`${baseUrl}/user/following`)
              .auth('token', process.env.ACCESS_TOKEN)
              .set('User-Agent', 'superagent');

            user = response.body.find((list) => list.login === username);
          });

          it(`then should follow ${username}`, () => {
            assert.exists(user);
          });
        });
      });
    });
  });
});
