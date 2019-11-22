//const expect = require('expect');
const path = require('path');
const fs = require('fs');
const Module = require('module');
const vm = require('vm');
const S = require('sanctuary');

const { testFunc1 } = require('..');

test('func1 for values greater 20', () => {
  const res = testFunc1(25);
  expect(res).toBe(625);
});

describe('tests in vm', () => {
  const cmPath = path.resolve(__dirname, '../index.js');
  const cmBody = fs.readFileSync(cmPath);
  const cmObj = { exports: {} };
  const { dir: cmDirname, base: cmFilename } = path.parse(cmPath);
  const cmRequire = x => {
    const res = {
      sanctuary: S,
      TESTMODULE: x => x,
      TESTMODULE2: { testFunction: () => () => 'testModule2' }
    }[x];
    if (!res) {
      console.log(`Can't require ${x}`);
      throw new TypeError();
    }
    return res;
  };

  vm.runInThisContext(Module.wrap(cmBody))(
    cmObj.exports,
    cmRequire,
    cmObj,
    cmFilename,
    cmDirname
  );

  const { testFunc2, testFunc3, requireElement } = cmObj.exports;

  test('testFunc2', () => {
    const res = testFunc2('TESTSTRING');
    expect(res).toEqual('> [TESTSTRING] (TESTSTRING)');
  });

  test('testFunc3', () => {
    const res = testFunc3(10)(20)(30);
    expect(res).toBe(60);
  });

  test('requireElement 1', () => {
    const map = {
      thing: 'TESTMODULE2'
    };
    const config = { name: 'thing' };
    const context = {};
    const res = requireElement(map)('testFunction')(config)(context); //?
    expect(res).toEqual(S.Right('testModule2'));
  });
  test('requireElement 2', () => {
    const map = {
      thing: 'TESTMODULE2'
    };
    const config = {};
    const context = {};
    const res = requireElement(map)('testFunction')(config)(context); //?
    expect(S.isLeft(res)).toBeTruthy();
  });
});
