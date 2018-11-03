/*  eslint-env node */

const gulp = require('gulp');
const minify = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const autoprifixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const pump = require('pump')

gulp.task('css', () => {
  return gulp.src('./css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(autoprifixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('scripts', function () {
  gulp.src('./js/**/*.js').pipe(babel()).pipe(concat('all.js')).pipe(gulp.dest('./dist/js'))
})

gulp.task('js', function (cb) {
  pump([ gulp.src('./js/**/*.js').pipe(sourcemaps.init()), uglify()
    .pipe(sourcemaps.write('dist/sourcemaps')).pipe(gulp.dest('dist/js'))], cb)
});

gulp.task('idb', () => {
  return gulp.src('./idb.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/'))
});

gulp.task('index-html', () => {
	return gulp.src('./index.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('dist/'))
});

gulp.task('restaurant-html', () => {
  return gulp.src('./restaurant.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist/'))
});

gulp.task('splash-html', () => {
  return gulp.src('./splash.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist/'))
});

gulp.task('images', () => {
	return gulp.src(['./img/*.jpg'])
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img'))
});

gulp.task('manifest', () => {
	return gulp.src(['./manifest.json'])
	.pipe(gulp.dest('dist/'))
});

gulp.task('lint', function () {
  return gulp.src(['js/**/*.js'])
    // eslint() attaches the lint output to the eslint property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe(eslint.failOnError());
});

gulp.task('watch', () => {
 gulp.watch(['./*.html', './**/*.js', './css/*.css', './manifest.json'], 'default')
});

gulp.task('default', ['js', 'css', 'html', 'splash-html', 'idb', 'scripts', 'lint', 'restaurant-html', 'index-html', 'manifest', 'images', 'watch']);