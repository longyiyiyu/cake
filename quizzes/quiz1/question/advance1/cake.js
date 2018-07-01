import { test as base } from '../base/cake';
import { expect } from 'chai';

function test(Robort) {
  // test base
  base(Robort);

  describe('Robort.advance1', () => {
    let robort;

    before(() => {
      robort = new Robort();
    });

    describe('#chat', () => {
      it('should say "I\'m Robort." when you ask "Who are you?"', () => {
        expect(robort.chat('Who are you?')).to.be.equal("I'm Robort.");
      });

      it('should say "I\'m find, and you?" when you ask "How are you?"', () => {
        expect(robort.chat('How are you?')).to.be.equal("I'm find, and you?");
      });
    });
  });
}

export default {
  test,
};
