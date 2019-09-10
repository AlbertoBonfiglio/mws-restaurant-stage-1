'use strict';

var gulp       = require('gulp'),
    source     = require('vinyl-source-stream'),
    rename     = require('gulp-rename'),
    browserify = require('browserify'),
    glob       = require('glob'),
    es         = require('event-stream'),
    workboxBuild = require('workbox-build');

    const webpack = require('webpack')
    const webpackConfig = require('./webpack.config.js')

gulp.task('compile', function(done) {
    glob('./build/**.js', function(err, files) {
        if(err) done(err);

        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .transform('babelify', {presets: ["@babel/preset-env"]})
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    extname: '.bundle.js'
                }))
                .pipe(gulp.dest('./dist'));
            });
         
        es.merge(tasks).on('end', done);
    })
});

gulp.task('move',['clean'], function(){
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src('/src/*.js', { base: './' })
    .pipe(gulp.dest('build'));
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
      swDest: 'build/sw.js',
      globDirectory: './',
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

exports.build = gulp.series('compile', moveSw)