var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    prefix        = require('gulp-autoprefixer'),
    browserSync   = require('browser-sync').create(),
    reload        = browserSync.reload;

var appPaths = {
    assets: [
        'app/images/*.*',
        'app/scripts/jsons/*.json'
    ],
    scripts: 'app/scripts/**/*',
    scss: 'app/scss/**/*',
    index: 'app/index.html'
};


gulp.task('styles', function() {
    return gulp.src(appPaths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: ['vendor/', 'vendor/bootstrap-sass/assets/stylesheets']}).on('error', sass.logError))
        .pipe(prefix(["last 5 version", "ie 9"]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/styles'));
});

gulp.task('serve', function() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: "./app",
            routes: {
                "/vendor": "vendor"
            }
        }
    });

    gulp.watch([appPaths.scripts, appPaths.assets, appPaths.index]).on('change', reload);
    gulp.watch(appPaths.scss, ['styles', reload]);
});


gulp.task('default', ['serve', 'styles']);