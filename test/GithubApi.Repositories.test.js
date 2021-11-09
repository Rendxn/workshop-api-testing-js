const agent = require('superagent');
const chaiSubset = require('chai-subset');
const chai = require('chai');

chai.use(chaiSubset);

const { expect, assert } = chai;
const md5 = require('md5');

const urlBase = 'https://api.github.com';

describe('Github Repositories Api Test', () => {
  const githubUserName = 'aperdomob';

  describe(`Getting user ${githubUserName}`, () => {
    let user;

    // This will execute before every test (it)
    before(async () => {
      ({ body: user } = await agent
        .get(`${urlBase}/users/${githubUserName}`)
        .set('User-Agent', 'agent'));
    });

    it('should have an username, company and location', async () => {
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.company).to.equal('Perficient Latam');
      expect(user.location).to.equal('Colombia');
    });

    describe(`getting repositories for ${githubUserName}`, async () => {
      let repos;
      let repo;
      const expectedRepo = 'jasmine-awesome-report';

      before(async () => {
        ({ body: repos } = await agent
          .get(user.repos_url)
          .set('User-Agent', 'agent'));
        repo = repos.find(({ name }) => name === expectedRepo);
      });

      it(`then should have ${expectedRepo} repo`, () => {
        assert.exists(repo);
        expect(repo.name).to.equal(expectedRepo);
        expect(repo.private).to.equal(false);
        expect(repo.description).to.equal('An awesome html report for Jasmine');
      });

      describe('when downloading repository', () => {
        let zip;
        const expectedMd5 = '78c9079c0c3b525e679271f06ec1109e';

        before(async () => {
          /**
           * @see https://docs.github.com/en/rest/reference/repos#download-a-repository-archive-zip
           */
          ({ text: zip } = await agent
            .get(`${repo.url}/zipball`)
            .set('User-Agent', 'agent')
            .buffer(true));
        });

        it('should have downloaded', () => {
          expect(md5(zip)).to.equal(expectedMd5);
        });

        describe('when getting contents', () => {
          let files;
          let readme;
          const readmeSubset = {
            name: 'README.md',
            path: 'README.md',
            sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
          };

          before(async () => {
            ({ body: files } = await agent
              .get(`${repo.url}/contents`)
              .set('User-Agent', 'agent'));

            readme = files.find(({ name }) => name === 'README.md');
          });

          it('then should have README.md', () => {
            assert.exists(readme);
            expect(readme).containSubset(readmeSubset);
          });

          describe('when downloading README.md file', () => {
            const expectedFileMd5 = '97ee7616a991aa6535f24053957596b1';
            let readmeContent;

            before(async () => {
              ({ text: readmeContent } = await agent
                .get(`${readme.download_url}`)
                .set('User-Agent', 'agent'));
            });

            it('then the file should be downloaded', () => {
              expect(md5(readmeContent)).to.equal(expectedFileMd5);
            });
          });
        });
      });
    });
  });
});
