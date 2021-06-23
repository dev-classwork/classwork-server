const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    },
    pool: {
      min: 0,
      max: 500,
      propagateCreateError: false
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'test.sqlite')
    },
    pool: {
      min: 0,
      max: 500,
      propagateCreateError: false
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 0,
      max: 100,
      propagateCreateError: false
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.REACT_APP_PROC_BD_HOST,
      port: process.env.REACT_APP_PROC_BD_PORT,
      user: process.env.REACT_APP_PROC_BD_USER,
      password: process.env.REACT_APP_PROC_BD_PASSWORD,
      database: process.env.REACT_APP_PROC_BD_DATABASE,
      ssl: true
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
    pool: {
      min: 0,
      max: 500,
      propagateCreateError: false
    },
  }
};
