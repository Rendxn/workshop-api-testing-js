const agent = require('superagent');
const chaiSubset = require('chai-subset');
const chai = require('chai');

chai.use(chaiSubset);

const { expect } = chai;
const { StatusCodes } = require('http-status-codes');

const baseUrl = 'https://api.github.com';
const myPromise = `
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 300);
});
`;

describe('When testing DELETE GitHub Api', () => {
  describe('when creating a gist', () => {
    const newGistContent = {
      description: "I promised I'd do this workshop",
      public: true,
      files: {
        'promise.js': {
          content: myPromise
        }
      }
    };
    let newGist;
    let newGistStatus;

    before(async () => {
      ({ body: newGist, status: newGistStatus } = await agent
        .post(`${baseUrl}/gists`)
        .send(newGistContent)
        .set('User-Agent', 'superagent')
        .auth('token', process.env.ACCESS_TOKEN));
    });

    it('then should have created a gist', () => {
      expect(newGistStatus).to.equal(StatusCodes.CREATED);
      expect(newGist).containSubset(newGistContent);
    });

    describe('when getting the created gist', () => {
      let gistStatus;

      before(async () => {
        ({ status: gistStatus } = await agent
          .get(newGist.url)
          .set('User-Agent', 'superagent')
          .auth('token', process.env.ACCESS_TOKEN));
      });

      it('then should exist', () => {
        expect(gistStatus).to.equal(StatusCodes.OK);
      });

      describe('then should DELETE gist', () => {
        let deletedGistStatus;

        before(async () => {
          ({ status: deletedGistStatus } = await agent
            .delete(newGist.url)
            .set('User-Agent', 'superagent')
            .auth('token', process.env.ACCESS_TOKEN));
        });

        it('then should exist', () => {
          expect(deletedGistStatus).to.equal(StatusCodes.NO_CONTENT);
        });

        describe('when getting gist again', () => {
          let status;
          before(async () => {
            ({ status } = await agent
              .get(newGist.url)
              .ok((res) => res.status === 404)
              .set('User-Agent', 'superagent')
              .auth('token', process.env.ACCESS_TOKEN));
          });

          it('then should not exist', () => {
            expect(status).to.equal(StatusCodes.NOT_FOUND);
          });
        });
      });
    });
  });
});
