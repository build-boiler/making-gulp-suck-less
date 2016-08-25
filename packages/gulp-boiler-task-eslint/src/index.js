import path from 'path';
import makeEslintConfig from 'boiler-config-eslint';
import formatter from 'eslint-friendly-formatter';

export default function(gulp, plugins, config) {
  const {environment, metaData, utils} = config;
  const {eslint} = plugins;
  const {isDev, isLocalDev} = environment;
  const {addbase, getTaskName} = utils;
  let src, base;

  return () => {
    const target = getTaskName(metaData);

    if (target === 'test') {
      base = path.join(__dirname, 'test/**/*.js');
      src = [addbase('test', '**/*.js')];
    } else if (target === 'build') {
      base = path.join(__dirname, 'src/**/*.js');
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
