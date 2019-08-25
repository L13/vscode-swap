//	Imports ____________________________________________________________________

const del = require('del');

const gulp = require('gulp');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript');

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

gulp.task('clean', () => {

	return del(['out']);

});

gulp.task('copy', () => {

	return gulp.src(['src/**/*.json'])
		.pipe(gulp.dest('out'));

});

gulp.task('script', () => {

	return rollup.rollup({
		input: 'src/extension.ts',
		plugins: [
			typescript({
				target: 'es6',
				lib: [
					'es6',
					'dom',
				],
				strict: true,
				removeComments: true,
			}),
		]
	}).then(bundle => {

		return bundle.write({
			file: './out/extension.js',
			format: 'umd',
			name: 'l13swap',
		});

	});

});

gulp.task('build', gulp.series('clean', 'copy', 'script'));

gulp.task('watch', () => {

	gulp.watch(['src/**/*.json'], gulp.parallel('copy'));

	gulp.watch(['src/*.ts'], gulp.parallel('script'));

});

//	Functions __________________________________________________________________

