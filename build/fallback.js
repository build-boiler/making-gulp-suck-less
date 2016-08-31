import path from 'path'
import gulp from 'gulp'
import load from 'gulp-load-plugins'
import {sync as globSync} from 'globby'
import babel from './tasks/babel'

const loadOpts = {
  pattern: [
    '!gulpy',
    'gulp-*',
    'gulp.*',
    'del',
    'run-sequence',
    'browser-sync'
  ],
  lazy: false,
  rename: {
    'gulp-util': 'gutil',
    'run-sequence': 'sequence',
    'gulp-if': 'gulpIf'
  }
}

const packages = ['./package.json', ...globSync('./packages/*/package.json')]
const plugins = packages.reduce((acc, fp) => {
  const config = path.resolve(fp)
  const opts = Object.assign({}, loadOpts, {config})
  let plugins

  try {
    plugins = load(opts)
  } catch (err) {
    // eslint-disable-line
  }

  return {
    ...acc,
    ...plugins
  }
}, {})
const isDev = process.argv.includes('watch')
const environment = {
  isLocalDev: true,
  isDev
}

const utils = {
  addbase(...args) {
    return path.join.apply(path, [process.cwd(), ...args])
  },
  addroot(...args) {
    return this.addbase.apply(this, ['packages', ...args])
  },
  getTaskName({name}) {
    return name.split(':').slice(-1)[0]
  }
}

const sources = {
  buildDir: 'dist'
}

const config = {environment, sources, utils}

gulp.task('babel', babel(gulp, plugins, config))
