const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const agent = require('superagent');

describe('Using HEAD', () => {
  const redirect = 'https://github.com/aperdomob/redirect-test';
  const redirectTo = 'https://github.com/aperdomob/new-redirect-test';

  describe('when HEAD /redirect-test', () => {
    let headResponse;

    before(async () => {
      headResponse = await agent.head(redirect).ok((res) => res.status === 301);
    });

    it('then should have redirect info', () => {
      expect(headResponse.status).to.equal(StatusCodes.MOVED_PERMANENTLY);
      expect(headResponse.headers.location).to.equal(redirectTo);
    });

    describe('when attempting to redirect', () => {
      let redirectResponse;

      before(async () => {
        redirectResponse = await agent.get(redirect);
      });

      it('should have redirected to new repo', () => {
        expect(redirectResponse.status).to.equal(StatusCodes.OK);
      });
    });
  });
});
