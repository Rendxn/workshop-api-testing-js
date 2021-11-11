const agent = require('superagent');
const { expect, assert } = require('chai');

const baseUrl = 'https://api.github.com';

describe('GitHub issue with POST and PATCH', () => {
  describe('when getting user', () => {
    let username;
    let reposUrl;
    let publicRepos;

    before(async () => {
      const { body: user } = await agent
        .get(`${baseUrl}/user`)
        .set('User-Agent', 'superagent')
        .auth('token', process.env.ACCESS_TOKEN);

      username = user.login;
      reposUrl = user.repos_url;
      publicRepos = user.public_repos;
    });

    it('then should have public repos', () => {
      expect(publicRepos).to.be.greaterThan(0);
    });

    describe('when getting user repos', () => {
      let repo;

      before(async () => {
        const { body: repos } = await agent
          .get(reposUrl)
          .set('User-Agent', 'superagent')
          .auth('token', process.env.ACCESS_TOKEN);

        repo = repos.pop();
      });

      it('then a given repo exists', () => {
        assert.exists(repo);
      });

      describe('when creating an issue', () => {
        const issueTitle = {
          title:
            'Issue created via the API while working on the api-testing-workshop'
        };
        let issue;

        before(async () => {
          ({ body: issue } = await agent
            .post(
              `https://api.github.com/repos/${username}/${repo.name}/issues`
            )
            .send(issueTitle)
            .set('User-Agent', 'superagent')
            .auth('token', process.env.ACCESS_TOKEN));
        });

        it('then should have created the issue', () => {
          assert.exists(issue);
          expect(issue.title).to.equal(issueTitle.title);
          expect(issue.body).to.equal(null);
        });

        describe('then updating the issue using PATCH', () => {
          const issueBody = { body: "Issue's body, buddy" };
          let patchedIssue;

          before(async () => {
            ({ body: patchedIssue } = await agent
              .patch(
                `https://api.github.com/repos/${username}/${repo.name}/issues/${issue.number}`
              )
              .send(issueBody)
              .set('User-Agent', 'superagent')
              .auth('token', process.env.ACCESS_TOKEN));
          });

          it('then should have a body', () => {
            expect(patchedIssue.title).to.equal(issueTitle.title);
            expect(patchedIssue.body).to.equal(issueBody.body);
          });
        });
      });
    });
  });
});
