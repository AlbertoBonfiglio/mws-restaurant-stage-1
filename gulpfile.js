'use strict';

var gulp         = require('gulp'),
    source       = require('vinyl-source-stream'),
    rename       = require('gulp-rename'),
    browserify   = require('browserify'),
    glob         = require('glob'),
    es           = require('event-stream'),
    workboxBuild = require('workbox-build'),
    clean        = require('gulp-clean');


gulp.task('clean', function(){
    return gulp.src(['dist/*'], {read:false})
    .pipe(clean());
    });

gulp.task('moveAssets', function(done){
    var filesToMove = [
        './src/assets/**/*.*',
        './src/css/**/*.*',
        './src/img/**/*.*',
        './src/js/**/*.*',
        './src/**/*.html',
        './src/manifest.json'
    ];
    gulp.src(filesToMove, { base: './src/' })
    .pipe(gulp.dest('dist'));
    done();
});
    
gulp.task('compileSw', function()  {
    return browserify('./src/sw.pre.js' )
        .transform('babelify', {presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source('sw.js'))
        .pipe(rename({extname: '.bundle.js'}))
        .pipe(gulp.dest('./dist'));
});

const buildSw = () => {
    return workboxBuild.injectManifest({
      swSrc: 'src/sw.js',
      swDest: 'src/sw.pre.js',
      globDirectory: './src/',
      globIgnores: [
          'node_modules/**/*', 
          'dist/**/*',
          '*.config.js', 
          '*.js', 
          '*.*.js'],
      globPatterns: [
        '**/*.{js,css,html}'
      ]
    }).then(resources => {
      console.log(`Injected ${resources.count} resources for precaching, ` +
          `totaling ${resources.size} bytes.`);
    }).catch(err => {
      console.log('Uh oh 😬', err);
    });
  }

gulp.task('build-sw', buildSw);

var buildSeries =  gulp.series(['clean', 'moveAssets', 'build-sw',  'compileSw']);

gulp.task('default', function() {
    gulp.watch('./src/sw.js', buildSeries);
    gulp.watch('./src/js/**/*.js', buildSeries);
    gulp.watch('./src/**/*.css', buildSeries);
    gulp.watch('./src/**/*.html', buildSeries);
});



exports.build = buildSeries;
 