import path from 'path';
import test from 'ava';
import sinon from 'sinon';
import vinylFile from 'vinyl-file';
import hooker from 'hooker';
import cp from 'child_process';
import plugin from '../src/plugin';

const base = path.join.bind(path, __dirname);
const keyPath = (fp) => path.join(
  path.basename(path.dirname(fp)), path.basename(fp)
);
const spy = sinon.spy();

test.before(t => {
  hooker.hook(cp, 'spawn', (...args) => {
    spy(...args);

    return {
      on(e, cb) {}
    };
  });
});

test.afterEach(t => {
  spy.reset();
});

test.after(t => {
  hooker.unhook(cp, 'spawn');
});

test.cb('should spawn the process with the node binary', t => {
  const stream = plugin();
  const writeMock = base('mocks/bleep.js');

  stream.write(
    vinylFile.readSync(writeMock)
  );
  stream.end();

  const {args} = spy.getCall(0);
  const [runner, cliArgs] = args;
  const [avaCli, file] = cliArgs;

  t.is(path.basename(runner), 'node');
  t.is(keyPath(avaCli), 'ava/cli.js');
  t.is(keyPath(file), keyPath(writeMock));
  t.end();
});

//not sure why even though we are mocking the child_process.spawn it is still opening iron-node ¯\_(ツ)_/¯
test.cb.skip('should spawn the process with iron-node in debug mode', t => {
  const stream = plugin({debug: true});
  const writeMock = base('mocks/bleep.js');

  stream.write(
    vinylFile.readSync(writeMock)
  );
  stream.end();

  const {args} = spy.getCall(0);
  const [runner, cliArgs] = args;
  const [avaCli, file] = cliArgs;

  t.is(runner, 'iron-node');
  t.is(keyPath(avaCli), 'ava/profile.js');
  t.is(keyPath(file), keyPath(writeMock));
  t.end();
});
