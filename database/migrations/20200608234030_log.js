exports.up = knex => {
    return knex.schema.createTable('log', (table) => {
        table.increments();
        table.date('date').notNullable();
        table.time('time', { precision: 6 }).notNullable();
        table.string ('action', 255).notNullable();
        table.boolean('success').defaultTo(false).notNullable();
    });
};

exports.down = knex => {
    return knex.schema.dropTable('log');
};
