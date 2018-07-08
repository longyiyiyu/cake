'use strict';

const MAP = {
  hello: 'hello',
  'Who are you?': "I'm Robort.",
  'How are you?': "I'm find, and you?",
};

const DEFAULTANS = "Sorry, I don't know what you say.";

/* code Robort here */
class Robort {
  chat(msg) {
    return MAP[msg] || DEFAULTANS;
  }
}

export default {
  ans: [Robort],
};
