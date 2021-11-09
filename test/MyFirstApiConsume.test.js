const agent = require('superagent')
const statusCode = require('http-status-codes')
const chai = require('chai')

const expect = chai.expect

/**
 * Passing arrow functions (aka “lambdas”) to Mocha is discouraged.
 * Lambdas lexically bind this and cannot access the Mocha context.
 * For example, the following code will fail:
 * @example
 * describe('my suite', () => {
 *  it('my test', () => {
 *      // should set the timeout of this test to 1000 ms; instead will fail
 *      this.timeout(1000);
 *      assert.ok(true);
 *  });
 * });
 *
 * If you do not need to use Mocha’s context, lambdas should work.
 * @see https://mochajs.org/#arrow-functions
 */

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip')

    expect(response.status).to.equal(statusCode.OK)
    expect(response.body).to.have.property('origin')
  })

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York',
    }

    const response = await agent.get('https://httpbin.org/get').query(query)

    expect(response.status).to.equal(statusCode.OK)
    expect(response.body.args).to.eql(query)
  })

  it('Consume PATCH service', async () => {
    const response = await agent.patch('https://httpbin.org/patch')
    expect(response.status).to.equal(statusCode.OK)
    expect(response.body).to.have.property('origin')
  })

  it('Consume PUT service', async () => {
    const response = await agent.put('https://httpbin.org/put')
    expect(response.status).to.equal(statusCode.OK)
    expect(response.body).to.have.property('origin')
  })

  it('Consume DELETE service', async () => {
    const response = await agent.delete('https://httpbin.org/delete')
    expect(response.status).to.equal(statusCode.OK)
    expect(response.body).to.have.property('origin')
  })

  it('Consume HEAD service', async () => {
    const response = await agent.head('https://httpbin.org/get')
    expect(response.status).to.equal(statusCode.OK)
    expect(response.headers).to.have.property('date')
  })
})
