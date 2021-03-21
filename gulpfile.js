//	Imports ____________________________________________________________________

const del = require('del');
const gulp = require('gulp');
const rollup = require('rollup');

const typescript = require('@rollup/plugin-typescript');

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
		onwarn,
		external: [
			'fs',
			'path',
			'vscode',
		],
		plugins: [
			typescript({
				include: [
					'src/**/*.ts',
				],
			}),
		]
	}).then(bundle => {
		
		return bundle.write({
			file: './out/extension.js',
			format: 'cjs',
			globals: {
				fs: 'fs',
				path: 'path',
				vscode: 'vscode',
			},
		});
		
	}, onerror);
	
});

gulp.task('build', gulp.series('clean', 'copy', 'script'));

gulp.task('watch', () => {
	
	gulp.watch(['src/**/*.json'], gulp.parallel('copy'));
	
	gulp.watch(['src/*.ts'], gulp.parallel('script'));
	
});

gulp.task('build & watch', gulp.series('build', 'watch'));

//	Functions __________________________________________________________________

function onwarn (warning) {
	
	console.warn(warning.toString());
	
}

function onerror (error) {
	
	console.error(`Error:${error.pluginCode ? ' ' + error.pluginCode : ''} ${error.message} ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
	
	throw error;
	
}