// var gulp = require('gulp');
// var gulpLoadPlugins = require('gulp-load-plugins');
// var fs = require('fs');
// var del = require('del');
// var browserify = require('browserify');
// var babelify = require('babelify');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var runSequence = require('run-sequence');
// var lazypipe = require('lazypipe');
// var browserSync = require('browser-sync').create();

// var $ = gulpLoadPlugins();
// var reload = browserSync.reload;

// // Lint JavaScript
// gulp.task('lint', function() {
//     return gulp.src(['app/**/*.js', '!node_modules/**'])
//         .pipe($.eslint())
//         .pipe($.eslint.format())
//         .pipe($.eslint.failOnError());
// });

// // Build responsive images
// gulp.task('images', ['fixed-images'], function() {
//     return gulp.src('app/img/*.jpg')
//         .pipe($.responsive({
//             '*.jpg': [
//                 { width: 300, rename: { suffix: '-300' }, },
//                 { width: 400, rename: { suffix: '-400' }, },
//                 { width: 600, rename: { suffix: '-600_2x' }, },
//                 { width: 800, rename: { suffix: '-800_2x' }, }
//             ]
//         }, {
//             quality: 40,
//             progressive: true,
//             withMetadata: false,
//         }))
//         .pipe(gulp.dest('.tmp/img'))
//         .pipe(gulp.dest('dist/img'));
// });

// // Copy fixed images
// gulp.task('fixed-images', function() {
//     return gulp.src('app/img/fixed/**')
//         .pipe(gulp.dest('.tmp/img/fixed'))
//         .pipe(gulp.dest('dist/img/fixed'));
// });

// // Copy manifest
// gulp.task('manifest', function() {
//     return gulp.src('app/manifest.json')
//         .pipe(gulp.dest('.tmp/'))
//         .pipe(gulp.dest('dist/'));
// });

// // Prep assets for dev
// gulp.task('html', function() {
//     var apiKey = fs.readFileSync('AIzaSyDBttHLAubz7c0Pv78H1E2G56vHMw1u9ug', 'utf8');

//     return gulp.src('app/*.html')
//         .pipe($.stringReplace('AIzaSyDBttHLAubz7c0Pv78H1E2G56vHMw1u9ug', apiKey))
//         .pipe($.useref())
//         .pipe($.if('*.css', $.autoprefixer()))
//         .pipe($.if('*.js', $.babel()))
//         .pipe($.if('*.html', $.htmlmin({
//             removeComments: true,
//             collapseBooleanAttributes: true,
//             removeAttributeQuotes: true,
//             removeRedundantAttributes: true,
//             removeEmptyAttributes: true,
//             removeScriptTypeAttributes: true,
//             removeStyleLinkTypeAttributes: true,
//             removeOptionalTags: true
//         })))

//     .pipe(gulp.dest('.tmp'));
// });

// // Scan HTML for js & css and optimize them
// gulp.task('html:dist', function() {
//     var apiKey = fs.readFileSync('AIzaSyDBttHLAubz7c0Pv78H1E2G56vHMw1u9ug', 'utf8');

//     return gulp.src('app/*.html')
//         .pipe($.stringReplace('AIzaSyDBttHLAubz7c0Pv78H1E2G56vHMw1u9ug', apiKey))
//         .pipe($.size({ title: 'html (before)' }))
//         .pipe($.useref({},
//             lazypipe().pipe($.sourcemaps.init)
//             // lazypipe().pipe(babel) // no coz css
//             // transforms assets before concat
//         ))
//         .pipe($.if('*.css', $.size({ title: 'styles (before)' })))
//         .pipe($.if('*.css', $.cssnano()))
//         .pipe($.if('*.css', $.size({ title: 'styles (after) ' })))
//         .pipe($.if('*.css', $.autoprefixer()))
//         .pipe($.if('*.js', $.babel()))
//         .pipe($.if('*.js', $.size({ title: 'scripts (before)' })))
//         .pipe($.if('*.js', $.uglifyEs.default()))
//         .pipe($.if('*.js', $.size({ title: 'scripts (after) ' })))
//         .pipe($.sourcemaps.write('.'))
//         .pipe($.if('*.html', $.htmlmin({
//             removeComments: true,
//             collapseWhitespace: true,
//             collapseBooleanAttributes: true,
//             removeAttributeQuotes: true,
//             removeRedundantAttributes: true,
//             minifyJS: { compress: { drop_console: true } },
//             removeEmptyAttributes: true,
//             removeScriptTypeAttributes: true,
//             removeStyleLinkTypeAttributes: true,
//             removeOptionalTags: true
//         })))

//     .pipe($.if('*.html', $.size({ title: 'html (after) ', showFiles: false })))
//         .pipe(gulp.dest('dist'));
// });

// // Process Service Worker
// gulp.task('sw', function() {
//     var bundler = browserify('./app/sw.js', { debug: true }); // ['1.js', '2.js']

//     return bundler
//         .transform(babelify, { sourceMaps: true }) // required for 'import'
//         .bundle() // concat
//         .pipe(source('sw.js')) // get text stream w/ destination filename
//         .pipe(buffer()) // required to use stream w/ other plugins
//         .pipe(gulp.dest('.tmp'));
// });

// // Optimize Service Worker
// gulp.task('sw:dist', function() {
//     var bundler = browserify('./app/sw.js', { debug: true }); // ['1.js', '2.js']

//     return bundler
//         .transform(babelify, { sourceMaps: true }) // required for 'import'
//         .bundle() // concat
//         .pipe(source('sw.js')) // get text stream w/ destination filename
//         .pipe(buffer()) // required to use stream w/ other plugins
//         .pipe($.size({ title: 'Service Worker (before)' }))
//         .pipe($.sourcemaps.init({ loadMaps: true }))
//         .pipe($.uglifyEs.default()) // minify
//         .pipe($.size({ title: 'Service Worker (after) ' }))
//         .pipe($.sourcemaps.write('./'))
//         .pipe(gulp.dest('dist'));
// });

// // Clean temp directory
// gulp.task('clean', function() {
//     return del(['.tmp/**/*']); // del files rather than dirs to avoid error
// });

// // Clean output directory
// gulp.task('clean:dist', function() {
//     return del(['dist/**/*']); // del files rather than dirs to avoid error
// });

// // Watch files for changes & reload
// gulp.task('serve', function() {
//     runSequence(['clean'], ['images', 'lint', 'html', 'sw', 'manifest'], function() {
//         browserSync.init({
//             server: '.tmp',
//             port: 8001
//         });

//         gulp.watch(['app/*.html'], ['html', reload]);
//         gulp.watch(['app/css/*.css'], ['html', reload]);
//         gulp.watch(['app/js/*.js'], ['lint', 'html', reload]);
//         gulp.watch(['app/sw.js'], ['lint', 'sw', reload]);
//         gulp.watch(['app/manifest.json'], ['manifest', reload]);
//     });
// });

// // Build and serve the fully optimized site
// gulp.task('serve:dist', ['default'], function() {
//     browserSync.init({
//         server: 'dist',
//         port: 8000
//     });

//     gulp.watch(['app/*.html'], ['html:dist', reload]);
//     gulp.watch(['app/css/*.css'], ['html:dist', reload]);
//     gulp.watch(['app/js/*.js'], ['lint', 'html:dist', reload]);
//     gulp.watch(['app/sw.js'], ['lint', 'sw', reload]);
//     gulp.watch(['app/manifest.json'], ['manifest', reload]);
// });

// // Build production files, the default task
// gulp.task('default', ['clean:dist'], function(done) {
//     runSequence(['images', 'lint', 'html:dist', 'sw:dist', 'manifest'], done);
// });

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var compress = require('compression');

var combineJS = [
    'js/register_sw.js',
    'js/dbhelper.js'
];
var individualJS = [
    'js/indb-test/index.js',
    'js/lib/lazyload.es2015.js',
    'js/lib/lazyload.min.js',
    'js/main.js',
    'js/restaurant_info.js'
];

gulp.task('default', ['copy-html', 'copy-images', 'sw'], function() {
    console.log('Done!');
});

gulp.task('run', ['default', 'browserSync'], function() {
    console.log('Starting the app');
});

//gulp.task('watch', ['browserSync', 'styles', 'copy-html', 'sw', 'scripts'], function(){
gulp.task('watch', ['browserSync', 'styles', 'copy-html', 'sw'], function() {
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('*.html', ['copy-html']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('dist', [
    'copy-html',
    'copy-images',
    'styles',
    'scripts-dist'
]);

gulp.task('scripts', function() {
    gulp.src('js/**/*.js')
        // .pipe(babel({
        //   presets: ['env']
        // }))
        //.pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));
});

// gulp.task('scripts-dist', function(){
//   gulp.src('js/**/*.js')
//       .pipe(sourcemaps.init())
//       .pipe(babel({
//         presets: ['env']
//       }))
//       //.pipe(concat('all.js'))
//       .pipe(uglify().on('error', e => console.log(e)))
//       .pipe(sourcemaps.write())
//       .pipe(gulp.dest('dist/js'));
// });

gulp.task('sw', function() {
    gulp.src('./sw.js')
        // .pipe(babel({
        //   presets: ['env']
        // }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('copy-html', ['scripts', 'styles'], function() {
    gulp.src(['./*.html', 'manifest.json'])
        .pipe(useref())
        // .pipe(gulpif('*.js', babel({ // added later
        //   presets: ['env']
        // })))
        // .pipe(gulpif('*.js', uglify())) //minify js - added later
        .pipe(gulp.dest('./dist'))
});

gulp.task('copy-images', function() {
    gulp.src('img/**/*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(concat('combined.css'))
        .pipe(gulp.dest('./dist/css'))
        // .pipe(browserSync.reload({
        //   stream: true
        // }))
    ;
});

gulp.task('browserSync', function() {
    browserSync.init({
        port: 8000,
        server: {
            baseDir: "./dist"
        },
        middleware: [compress()]
            // https: {
            //   key: fs.readFileSync("ssl/filename.key", "utf8"),
            //   cert: fs.readFileSync("ssl/filename.crt", "utf8")
            //   //passphrase: 'password'
            // },
            // https: {
            //   key: "ssl/2/server.key",
            //   cert: "ssl/2/server.crt"
            //   //passphrase: 'password'
            // }
    });
});