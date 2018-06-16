'use strict';

const MAP = {
  hello: 'hello',
  'Who are you?': "I'm Robort.",
  'How are you?': "I'm find, and you?"
};

const DEFAULTANS = "Sorry, I don't know what you say.";

class Robort {
  chat(msg) {
    return MAP[msg] || DEFAULTANS;
  }
}

module.exports = {
  ans: [Robort]
};