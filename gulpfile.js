'use strict';
// generated on 2014-07-31 using generator-gulp-webapp 0.1.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('templates', function() {
  return gulp.src('app/templates/**/*.hbs')
    .pipe($.emberHandlebars({outputType: 'browser'}))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10
    }))
    .pipe($.autoprefixer('last 3 version'))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['templates', 'styles'], function() {
  var lazypipe = require('lazypipe');
  var cssChannel = lazypipe()
    .pipe($.csso)
    .pipe($.replace, 'bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap', 'fonts');
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', cssChannel()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.if('**/*.{eot,svg,ttf,woff}', $.flatten()))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function() {
  return gulp.src(['app/*.*', '!app/*.html'], {dot: true})
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', function() {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('app'))
    .use(serveStatic('.tmp'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'templates', 'styles'], function() {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({directory: 'bower_components'}))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'bower_components',
      exclude: ['bootstrap-sass-official']
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['jshint', 'connect', 'serve'], function() {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    '{app,.tmp}/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/**/*.js', ['jshint']);
  gulp.watch('app/templates/**/*.hbs', ['templates']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function() {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
