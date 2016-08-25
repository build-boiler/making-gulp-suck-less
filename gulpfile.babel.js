import 'babel-polyfill';
import gulp from 'gulp';
import babel from './tasks/babel';
import bootstrap from './bootstrap.js';

const {tasks, plugins, config} = bootstrap(gulp);
const {utils} = config;
const {addbase} = utils;

gulp.task('lint:test', tasks.eslint);
gulp.task('lint:build', tasks.eslint);
gulp.task('lint', gulp.parallel('lint:test', 'lint:build'));
gulp.task('babel', babel(gulp, plugins, config));

const baseTasks = gulp.series('lint', 'babel');

gulp.task('watch:build', () => {
  gulp.watch([
    addbase('packages/*/src/**/*.js'),
    addbase('gulpfile.babel.js')
  ]).on('change', baseTasks);
});

gulp.task('build', baseTasks);
gulp.task('watch', gulp.series(baseTasks, 'watch:build'));
gulp.task('default', gulp.series('babel'));
