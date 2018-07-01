import { expect } from 'chai';

function test(Robort) {
  describe('Robort.advance2', () => {
    let robort;

    before(() => {
      robort = new Robort();
    });

    describe('#findSame', () => {
      it('should find the same things between two array', () => {
        expect(robort.findSame([1, 2, 3], [2, 3, 4])).to.deep.equal([2, 3]);
      });
    });
  });
}

export default {
  test,
};
