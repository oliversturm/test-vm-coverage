const S = require('sanctuary');

const testFunc1 = x => {
  if (x > 20) return x * x;
  if (x < 10) return -x;
  return x + 10;
};

const testFunc2 = str => {
  const testModule = require('TESTMODULE');
  const prefix = '> ';
  const postfix = ` (${str})`;
  const result = prefix + `[${str}]` + postfix;
  return testModule(result);
};

const testFunc3 = one => two => three => one + two + three;

const requireEither = S.encase(require);

const requireElement = map => functionName => config => context =>
  S.chain(res =>
    S.maybe_(() =>
      S.Left(
        `Function '${functionName}' not found for ${JSON.stringify(config)}`
      )
    )(S.encase(f => f(config)(context)))(S.unchecked.value(functionName)(res))
  )(
    S.maybe_(() => requireEither(config.path))(requireEither)(
      S.unchecked.value(config.name || '')(map)
    )
  );

module.exports = { testFunc1, testFunc2, testFunc3, requireElement };
