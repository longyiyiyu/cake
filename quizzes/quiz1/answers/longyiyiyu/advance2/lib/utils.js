import { intersection } from 'lodash';

function findSame(a, b) {
  return intersection(a, b);
}

export default {
  findSame,
};
