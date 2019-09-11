'use strict';

var gulp         = require('gulp'),
    source       = require('vinyl-source-stream'),
    rename       = require('gulp-rename'),
    browserify   = require('browserify'),
    glob         = require('glob'),
    es           = require('event-stream'),
    workboxBuild = require('workbox-build'),
    clean        = require('gulp-clean');;

    const webpack = require('webpack')
    const webpackConfig = require('./webpack.config.js')

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
    
// Not used
gulp.task('compile', function(done) {
    glob('./src/**.pre.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            console.log(entry);
            return browserify({ entries: [entry] } )
                .transform('babelify', {presets: ["@babel/preset-env"]})
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist' ));
            });
         
        es.merge(tasks).on('end', done);
    })
});

gulp.task('compileSw', function()  {
    return browserify('./src/sw.pre.js' )
        .transform('babelify', {presets: ["@babel/preset-env"]})
        .bundle()
        .pipe(source('sw.js'))
        .pipe(rename({extname: '.bundle.js'}))
        .pipe(gulp.dest('./dist'));
});


function moveSw() {
return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            return reject(err)
        }
        if (stats.hasErrors()) {
            return reject(new Error(stats.compilation.errors.join('\n')))
        }
        resolve()
    })
})
}

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

exports.build = gulp.series('clean', 'moveAssets', 'build-sw',  'compileSw')