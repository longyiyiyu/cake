'use strict';
/**
 * utils
 * cake-cli 的 utils
 *
 * @author longyiyiyu
 *
 */

const shelljs = require('shelljs');

/**
 * 检查是否在 cake 项目里面
 * @returns {Boolean} 是否在 cake 项目里面
 */
function checkIsInProject() {
  return true;
}

/**
 * 检查题目 ID 是否合法
 * 有相应的题目才算合法
 * @param {Number} ID 题目id
 * @returns {Boolean} 是否合法
 */
function isValidQuestionID(ID) {
  return true
}

/**
 * 从 pwd 获取题目 ID
 * @returns {String} 题目id，如果没有返回''
 */
function getQuestionIDFromPWD() {
  return ''
}

/**
 * 获取用户名
 */
function getUserName() {
  return shelljs.exec('git config --get user.name', {
    silent: true
  });
}

/**
 * 检查该题目下该用户是否已经有答案
 * @param {String} id 题目id
 * @param {String} userName 用户名
 * @returns {Boolean} 是否已经有答案
 */
function hasAnswerFromUser(id, userName) {
  return false;
}

module.exports = {
  checkIsInProject,
  isValidQuestionID,
  getQuestionIDFromPWD,
  getUserName,
  hasAnswerFromUser
};