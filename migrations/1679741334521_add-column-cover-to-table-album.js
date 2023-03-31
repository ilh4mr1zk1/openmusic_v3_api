exports.shorthands = undefined;

exports.up = pgm => {
	pgm.addColumn('album', {
		cover: {
			type: 'VARCHAR(150)',
			
		}
	});
};

exports.down = pgm => {
	pgm.dropColumn('album', 'cover');
};
