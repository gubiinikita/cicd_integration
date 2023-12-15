const Mocha = require('mocha');

const mochaMain = new Mocha({
  reporter: '@reportportal/agent-js-mocha',
  reporterOptions: {
    endpoint: 'https://rtportal.devopdata.co/api/v1',
    apiKey: 'cccfcc8e-eb46-4121-9cf3-2f06d470196e',
    launch: 'I wanna fail',
    project: 'mykyta_test_project',
    description: 'Who cares about those descriptions?',
  },
  timeout: 250000,
});

try {
  mochaMain.files = [
    'spec/attributesTest.spec.js',
    'spec/descriptionsTest.spec.js',
    'spec/logTest.spec.js',
    'spec/statusesTest.spec.js',
    'spec/testCaseIdTest.spec.js',
  ];
  mochaMain.run((failures) => process.on('exit', () => process.exit(failures))); // exit with non-zero exit code, other wise fails will not fail mocha run
} catch (err) {
  console.error(`Test suite doesn't exists or set. Error: ${err}`);
}
