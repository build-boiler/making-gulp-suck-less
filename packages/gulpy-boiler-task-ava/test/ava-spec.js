import path from 'path'
import test from 'ava'
import sinon from 'sinon'
import {isStream} from 'gulp-util'
import AvaTask from '../src/ava'
import makeConfig from '../../gulpy-boiler-config'

const spy = sinon.spy()
const gulp = {
  src(s) {
    spy(s)

    return this
  },
  pipe(stream) {
    spy(stream)

    return this
  }
}

test.afterEach(t => {
  spy.reset()
})

const name = 'ava'
const config = makeConfig()
const plugins = {}

test('should configure ava task', t => {
  const task = new AvaTask(name, plugins, config)
  const {ava, sources} = task.config

  t.truthy(ava.verbose)
  t.is(ava.require, path.resolve(__dirname, '..', 'src/babel-hook.js'))
  t.is(sources.srcDir, 'packages/*/test')
})

test('should call gulp with the src and plugin', t => {
  const task = new AvaTask(name, plugins, config)
  const gulpFn = task.run(gulp)
  const stream = gulpFn()
  const [srcArgs] = spy.getCall(0).args
  const [pipeArgs] = spy.getCall(1).args

  t.is(stream, gulp)
  t.is(srcArgs, path.join(process.cwd(), 'packages/*/test/**/*-spec.js'))
  t.truthy(isStream(pipeArgs))
})
