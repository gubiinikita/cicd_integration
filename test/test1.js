const chai = require('chai');
const assert = chai.assert;

describe('files 1', function () {
  describe('export 1', function () {
    it('should export pdf 1', async function () {
      assert.isTrue(true);
    });

    it('should export html 1', async function () {
      assert.isTrue(true);
    });

    it('should export yml 1', async function () {
      assert.isTrue(true);
    });

    it('should export text 1', async function () {
      throw new Error('An exception occurred');
    });
  });
});