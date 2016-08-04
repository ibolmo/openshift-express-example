const gulp = require('gulp');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const wait = require('gulp-wait');

gulp.task('css', () => gulp.src('public/**/*.css').pipe(livereload()));

const jsFiles = [
  './node_modules/whatwg-fetch/fetch.js',
  './node_modules/socket.io-client/socket.io.js',
];

gulp.task('js', () => {
  gulp.src(jsFiles)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('jade', () => gulp.src('views/**/*.jade').pipe(livereload()));

gulp.task('watch', () => {
  gulp.watch('public/**/*.css', ['css']);
  gulp.watch('public/**/*.js', ['js']);
  gulp.watch('views/**/*.jade', ['jade']);
});

gulp.task('start', () => {
  livereload.listen();

  nodemon({
    verbose: 'true',
    script: 'server.js',                 // file that starts server
    ext: 'js',                           // which files to restart server
    env: { NODE_ENV: 'development' },  // environment variables
  }).on('start', () => {
    gulp.src('server.js')
      .pipe(wait(500))                  // prevent browser 'offline'
      .pipe(livereload());
  });
});

gulp.task('build', ['js']);

gulp.task('default', ['start', 'watch']);
