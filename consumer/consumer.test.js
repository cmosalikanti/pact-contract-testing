// consumer/consumer.spec.js
const pact = require('@pact-foundation/pact');
const { getUser, getUsers } = require('./consumer');
const axios = require('axios');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const mockProvider = new pact.Pact({
  consumer: 'ConsumerApp',
  provider: 'ProviderApp',
  dir: path.resolve(process.cwd(), 'pacts'), // Directory to store pact files
  logLevel: 'INFO',
  log: path.resolve(process.cwd(), 'logs'),
  spec: 2,
  port: 1234,
});

describe('Pact with Provider', () => {
  beforeEach(() => mockProvider.setup());

  afterEach(() => mockProvider.finalize());

  it('should receive the expected user data', async () => {
    // Arrange: Setup Pact interactions
    await mockProvider.addInteraction({
      state: 'provider has a list of users',
      uponReceiving: 'a request for a user',
      withRequest: {
        method: 'GET',
        path: '/user/1',
      },
      willRespondWith: {
        status: 200,
        body: { id: 1, name: 'John Doe' },
      },
    });

    // Act: Consumer makes the request
    const response = await getUser(1);

    // Assert: Verify that the mockProvider responds as expected
    expect(response.data.id).to.equal(1);
    expect(response.data.name).to.equal('John Doe')

    expect(response.data).to.deep.equal({
      id: 1,
      name: 'John Doe',
    });

    // Pact verification (check if the contract is satisfied)
    await mockProvider.verify();
  });

  it('should receive all the users', async () => {
    // Arrange: Setup Pact interactions
    await mockProvider.addInteraction({
      state: 'provider has a list of users',
      uponReceiving: 'a request for all users',
      withRequest: {
        method: 'GET',
        path: '/users',
      },
      willRespondWith: {
        status: 200,
        body: [
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' },
        ]
        }
    });

    // Act: Consumer makes the request
    const response = await getUsers();

    // Assert: Verify that the mockProvider responds as expected

    expect(response.data).to.deep.equal([
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
    ]);

    // Pact verification (check if the contract is satisfied)
    await mockProvider.verify();
  });
});
