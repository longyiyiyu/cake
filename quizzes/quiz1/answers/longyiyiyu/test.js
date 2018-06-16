const fs = require('fs');
const path = require('path');

const shell = require('shelljs');
const babel = require('babel-core');
const ejs = require('ejs');

const BASEDIRNAME = 'base';
const ADVANCEDIRNAME = 'advance';
const TMPDIRNAME = 'tmp';
const TMPQUESTIONDIR = 'q';
const TMPANSWERDIR = 'a';
const QUESTIONMAIN = 'cake';
const ANSWERMAIN = 'ans';
const CUSTOMTESTFILENAME = 'test.js';

function babelTransform(src, dist, options = {}) {
  // console.log('>>>> babelTransform:', src, dist);
  const stats = fs.statSync(src);
  if (stats.isFile()) {
    fs.writeFileSync(dist, babel.transformFileSync(src, options).code);
  } else if (stats.isDirectory()) {
    shell.mkdir(dist);
    fs.readdirSync(src).forEach((file) => {
      babelTransform(path.join(src, file), path.join(dist, file), options);
    });
  }
}

function getIstanbulConfigFileString(dirName) {
  return `reporting:\n  dir: ./${dirName}/coverage`;
}

function walkDirs(dir, cb) {
  fs.readdirSync(dir).forEach((file) => {
    const stats = fs.statSync(path.join(dir, file));

    if (file === BASEDIRNAME || (file.startsWith(ADVANCEDIRNAME) && stats.isDirectory())) {
      cb(file);
    }
  });
}

/*
 *
 * @params {String} pwd 编译的当前路径，应该是 {root}/quizzes/quiz1/answers/{userName}/
 * 
 */
function compile(pwd) {
  // 准备目录
  shell.cd(pwd);
  shell.rm('-rf', `./${TMPDIRNAME}`);
  shell.mkdir(TMPDIRNAME);
  shell.mkdir(`${TMPDIRNAME}/${TMPQUESTIONDIR}`);
  shell.mkdir(`${TMPDIRNAME}/${TMPANSWERDIR}`);

  // 编译问题
  const questionDirPath = path.join(pwd, '../../question');
  walkDirs(questionDirPath, (dir) => {
    babelTransform(path.join(questionDirPath, dir), path.join(pwd, TMPDIRNAME, TMPQUESTIONDIR, dir));
  });

  // 编译答案
  walkDirs(pwd, (dir) => {
    babelTransform(path.join(pwd, dir), path.join(pwd, TMPDIRNAME, TMPANSWERDIR, dir));
  });
}

/*
 *
 * @params {String} pwd 编译的当前路径，应该是 {root}/quizzes/quiz1/answers/{userName}/
 * 
 */
function run(pwd) {
  console.log('>>>> run:', process.argv);

  const type = process.argv[2] || BASEDIRNAME;

  // 参数检查

  // 检测是否有自定义测试用例
  const customTestFilePath = path.join(pwd, TMPDIRNAME, TMPANSWERDIR, type, CUSTOMTESTFILENAME);
  const hasCustomTest = fs.existsSync(customTestFilePath);

  const ejsFilePath = path.join(pwd, 'assets/main.ejs');
  const mainFilePath = path.join(pwd, TMPDIRNAME, 'main.js');
  ejs.renderFile(
    ejsFilePath,
    {
      type,
      hasCustomTest,
    },
    null,
    (err, str) => {
      if (err) {
        throw new Error(`generate main file err: ${JSON.stringify(err)}`);
      }

      fs.writeFileSync(mainFilePath, str);
    }
  );

  shell.cd(pwd);
  shell.exec(
    `node ../../../../node_modules/istanbul/lib/cli cover ../../../../node_modules/mocha/bin/_mocha -- ./${TMPDIRNAME}/main.js && node ../../../../node_modules/istanbul/lib/cli check-coverage --statement 90 --branch 90 --function 90`
  );
}

function build(qDir, ansDir) {
  console.log(`build params: ${qDir} ${ansDir} ${path.dirname(qDir)} ${path.basename(qDir)}`);

  const type = path.basename(qDir);
  const tmpDirName = `tmp_${type}`;
  const pwd = path.join(ansDir, '..');

  // 跳转到当前目录
  shell.cd(pwd);

  // 创建目录
  shell.rm('-rf', `./${tmpDirName}`);
  shell.mkdir(tmpDirName);
  shell.mkdir(`${tmpDirName}/${TMPQUESTIONDIR}`);
  shell.mkdir(`${tmpDirName}/${TMPANSWERDIR}`);

  const sourceQuestionPath = path.join(qDir, `${QUESTIONMAIN}.js`);
  const distQuestionPath = path.join(__dirname, `./${tmpDirName}/${TMPQUESTIONDIR}/${QUESTIONMAIN}.js`);
  const distAnswerDirPath = path.join(__dirname, `./${tmpDirName}/${TMPANSWERDIR}`);

  // babel 编译 question 文件
  babelTransform(sourceQuestionPath, distQuestionPath);

  // babel 编译 answer 文件
  babelTransform(ansDir, distAnswerDirPath);

  shell.cp('./assets/main.js', `./${tmpDirName}`);

  fs.writeFileSync(path.join(pwd, '.istanbul.yml'), getIstanbulConfigFileString(tmpDirName));

  shell.exec(
    `node ../../../../node_modules/istanbul/lib/cli cover ../../../../node_modules/mocha/bin/_mocha -- ./${tmpDirName}/main.js && node ../../../../node_modules/istanbul/lib/cli check-coverage --statement 90 --branch 90 --function 90`
  );
  // shell.exec(
  //   'node node_modules/istanbul/lib/cli cover node_modules/mocha/bin/_mocha -- ./tmp/main.js && istanbul check-coverage --statement 90 --branch 90 --function 90'
  // );
}

// const type = 'advance1';
// const questionDirPath = path.join(__dirname, `../../question/${type}`);
// const answerDirPath = path.join(__dirname, type);

// build(questionDirPath, answerDirPath);

compile(__dirname);
run(__dirname);
