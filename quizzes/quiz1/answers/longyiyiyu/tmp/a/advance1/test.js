'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = test;

var _chai = require('chai');

var _ans = require('./ans');

console.log('>>>>> aaaa:', _ans.ans);

const [Robort] = _ans.ans;

function test() {
  describe('Robort.advance1', () => {
    let robort;

    before(() => {
      robort = new Robort();
    });

    describe('#chat', () => {
      it('should say "Sorry, I don\'t know what you say." when you say the words I do not know', () => {
        (0, _chai.expect)(robort.chat('no match')).to.be.equal('Sorry, I don\'t know what you say.');
      });
    });
  });
}