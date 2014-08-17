/**
 * Install bower components.
 *
 * ---------------------------------------------------------------
 *
 * Installs bower components and copies the required files into the assets folder structure.
 *
 */

module.exports = function(gulp, plugins, growl) {
	gulp.task('bower:install', function() {
		return plugins.bower()
				.pipe(gulp.dest('./bower_components'))
				.pipe(plugins.if(growl, plugins.notify({ message: 'Bower install task complete' })));
	});
	gulp.task('bower:copy', function() {
		return gulp.src(plugins.files(), { base: './bower_components' })
				.pipe(gulp.dest('./assets/vendor'))
				.pipe(plugins.if(growl, plugins.notify({ message: 'Bower copy task complete' })));
	});
}
