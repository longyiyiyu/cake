'use strict';

var _cake = require('../base/cake');

var _chai = require('chai');

function test(Robort) {
  // test base
  (0, _cake.test)(Robort);

  describe('Robort.advance1', () => {
    let robort;

    before(() => {
      robort = new Robort();
    });

    describe('#chat', () => {
      it('should say "I\'m Robort." when you ask "Who are you?"', () => {
        (0, _chai.expect)(robort.chat('Who are you?')).to.be.equal("I'm Robort.");
      });

      it('should say "I\'m find, and you?" when you ask "How are you?"', () => {
        (0, _chai.expect)(robort.chat('How are you?')).to.be.equal("I'm find, and you?");
      });
    });
  });
}

module.exports = {
  test
};