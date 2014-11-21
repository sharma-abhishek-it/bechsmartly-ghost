'use strict'

gulp = require('gulp')
plugins = require('gulp-load-plugins')()
lazypipe = require('lazypipe')
gfi = require('gulp-file-include')
tap = require('gulp-tap')
fs = require('fs')

templates_path = 'content/themes/casper/'
hbs_glob = templates_path + '**/*.hbs'
css_path = templates_path + 'assets/css/'
css_glob = css_path + '**/*.css'
js_glob = templates_path + 'assets/js/*.js'


onError = (err) ->
  plugins.util.log plugins.util.colors.red("Error"), err.message
  this.emit 'end'

gulp.task 'bootstrap', ->
  gulp.src 'styles/bootstrapValidator.min.css'
  .pipe gulp.dest css_path

  gulp.src 'styles/**/bootstrap.less'
  .pipe plugins.less()
  .on 'error', onError
  .pipe gulp.dest css_path

gulp.task 'less', ->
  gulp.src 'styles/style.less'
  .pipe plugins.less()
  .on 'error', onError
  .pipe gulp.dest(css_path)

gulp.task 'livereload', ->
  reloader = plugins.livereload "0.0.0.0:35729"
  reloader.changed ""

  lr = (glob) ->
    gulp.watch(glob)
    .on 'change', (file) -> reloader.changed file.path
    .on 'error', onError

  lr glob for glob in [hbs_glob, css_glob, js_glob]

  gulp.watch 'styles/*.less', ['less']
  gulp.watch 'styles/bootstrap_3.3.1/*.less', ['bootstrap']

  ghost = require 'ghost'
  process.env.NODE_ENV = 'development'
  ghost({ config: __dirname + '/ghost-config.js' })
  .then (ghostServer) -> ghostServer.start()

gulp.task 'copy', ['bootstrap', 'less'], ->
  gulp.src 'content/themes/**/*'
  .pipe gulp.dest('build/content/themes')

gulp.task 'analytics_snippet', ['copy'], ->
  gulp.src 'build/content/themes/**/*.hbs'
  .pipe tap (file) ->
    analyticsPath = __dirname + '/scripts/analytics_snippet.html'
    analytics = String(fs.readFileSync(analyticsPath))

    contents = file.contents.toString()
    contents = contents.replace "<!-- analytics_snippet -->", analytics
    file.contents = new Buffer contents
    return;
  .pipe gulp.dest('build/content/themes')

gulp.task 'build', ['copy', 'analytics_snippet']

gulp.task 'default', ['bootstrap','less','livereload']
