const path = require('path');
const Verifier = require('@pact-foundation/pact').Verifier;

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const { server } = require('./provider.js');  

let app;
const hostname = "127.0.0.1"
let port;

// Pact provider verification
describe('Pact with ConsumerApp', () => {
    beforeEach(async () => {
        port = 3000;
        // Start producer server before running the contract tests
        app = server.listen('3000', hostname, () => {
                          console.log(`Provider service listening on http://${hostname}:${port}`);
                });
    });
    
    afterEach(() => {
        // Stop the producer server after running the tests
        if (app) {
            console.log('stopping the server...')
            app.close();
        }
    });

    it('should validate the expectations of ConsumerApp', function() {
        let opts;
        
        //  the below timeout is needed for the fix of "Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called"
        this.timeout(5000);

        opts = {
            provider: 'UserService',
            consumer: 'ConsumerApp',
            providerBaseUrl: `http://${hostname}:${port}`,
            pactUrls: [path.resolve(process.cwd(), './pacts','ConsumerApp-ProviderApp.json')],
            logLevel: "info"
        }

        // Define what the producer should return in the Pact contract
        return new Verifier(opts)
                    .verifyProvider()
                    .then((output) => {
                            console.log("Pact Verification Complete!");
                            console.log(output);
                    })
                    .catch((e) => {
                        console.error("Pact verification failed :(", e);
                        throw e;
                    });

    });
});
