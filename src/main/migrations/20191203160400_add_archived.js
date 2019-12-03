exports.up = knex => {
    return knex.schema.table('course', function(t) {
        t.boolean('archived').notNull().defaultTo(false);
    });
};

exports.down = knex => {
    return knex.schema.table('course', function(t) {
        t.dropColumn('archived');
    });
};