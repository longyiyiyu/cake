import { expect } from 'chai';

function test(Robort, a, abc) {
  describe('Robort.base', () => {
    let robort;

    before(() => {
      robort = new Robort();
    });

    describe('#chat', () => {
      it('should say hello when you say hello', () => {
        expect(robort.chat('hello')).to.be.equal('hello');
      });
    });
  });
}

module.exports = {
  test,
};
