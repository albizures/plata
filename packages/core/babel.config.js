module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				loose: true,
				targets: {
					browsers: ['last 2 versions'],
				},
			},
		],
	],
};
