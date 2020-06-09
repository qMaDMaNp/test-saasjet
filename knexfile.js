module.exports = {

  development: {
      client: 'mysql',
      connection: {
          host : '127.0.0.1',
          user : 'saasjetAdmin',
          password : 'secret',
          database : 'saasjet'
      },
      migrations: {
          tableName: 'knex_migrations',
          directory: './database/migrations'
      }
  }
};
