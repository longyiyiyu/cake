'use strict';

var _chai = require('chai');

function test(Robort) {
  describe('Robort.base', () => {
    let robort;

    before(() => {
      robort = new Robort();
    });

    describe('#chat', () => {
      it('should say hello when you say hello', () => {
        (0, _chai.expect)(robort.chat('hello')).to.be.equal('hello');
      });
    });
  });
}

module.exports = {
  test
};