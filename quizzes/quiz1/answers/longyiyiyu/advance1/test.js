import { expect } from 'chai';
import { ans } from './ans';

const [ Robort ] = ans;

export default function test() {
  describe('Robort.advance1', () => {
    let robort;

    before(() => {
      robort = new Robort();
    });

    describe('#chat', () => {
      it('should say "Sorry, I don\'t know what you say." when you say the words I do not know', () => {
        expect(robort.chat('no match')).to.be.equal('Sorry, I don\'t know what you say.');
      });
    });
  });
}
