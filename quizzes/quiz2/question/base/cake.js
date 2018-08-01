import { expect } from 'chai';

const TIMEOUT = 26 * 1000;
const COUNT = 26 * 10000;
const CHECK_THRESHOLD = 26 * 10;

function check(map) {
  Object.keys(map).forEach((c) => {
    const N = map[c].length;
    let average = 0;
    let sum = 0;

    map[c].forEach((count) => {
      average += count;
    });

    average = average / N;

    map[c].forEach((count) => {
      sum += Math.pow(count - average, 2);
    });

    const variance = Math.round(Math.sqrt(sum / N));

    // discrete limit
    expect(variance).to.be.lte(CHECK_THRESHOLD);
  });
}

function test(shuffle) {
  describe('shuffle', () => {
    const ABC = 'abcdefghijklmnopqrstuvwxyz';
    const retMap = {};
    let array;

    before(() => {
      ABC.split('').forEach((c) => {
        retMap[c] = [];
      });
    });

    beforeEach(() => {
      array = ABC.split('');
    });

    it('should not change the array', () => {
      const copy = array.slice(0);
      shuffle(array);
      expect(array).to.deep.equal(copy);
    });

    it('should return a new array', () => {
      const ret = shuffle(array);
      expect(ret instanceof Array).to.be.true;
      expect(ret.length).to.be.equal(array.length);
    });

    it('should pass the time limit and discrete limit', function() {
      // time limit
      this.timeout(TIMEOUT);

      for (let i = 0; i < COUNT; ++i) {
        const shuffledArr = shuffle(array);

        shuffledArr.forEach((c, i) => {
          retMap[c][i] = retMap[c][i] || 0;
          retMap[c][i]++;
        });
      }

      check(retMap);
    });
  });
}

export default {
  test,
};
