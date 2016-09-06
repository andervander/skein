var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    prefix        = require('gulp-autoprefixer'),
    connect       = require('gulp-connect');

var appPaths = {
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
    connect.server({
        root: ['app', '.'],
        port: 3000
    });

    gulp.watch(appPaths.scss, ['styles']);
});


gulp.task('default', ['serve', 'styles']);