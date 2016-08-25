import path from 'path';
import makeEslintConfig from 'boiler-config-eslint';
import formatter from 'eslint-friendly-formatter';

export default function(gulp, plugins, config, metaData) {
  const {environment, utils} = config;
  const {eslint} = plugins;
  const {isDev, isLocalDev} = environment;
  const {addbase, getTarget} = utils;
  let src, base;

  return () => {
    const target = getTarget(metaData);
    const rootDir = path.resolve(__dirname, '..', '..', '*');

    if (target === 'test') {
      base = path.join(rootDir, 'test/**/*.js');
      src = [addbase('test', '**/*.js')];
    } else if (target === 'build') {
      base = path.join(rootDir, 'src/**/*.js');
      src = [
        addbase('tasks', '**/*.js'),
        addbase('gulpfile.babel.js')
      ];
    }

    /**
     * Lint internal files if developing locally with Lerna
     */
    if (isLocalDev) {
      src.push(base);
    }

    const eslintConfig = makeEslintConfig({
      basic: false,
      react: false,
      generate: false,
      isDev,
      lintEnv: target
    });

    return gulp.src(src)
      .pipe(eslint(eslintConfig))
      .pipe(eslint.format(formatter));
  };
}
