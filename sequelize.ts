import { Sequelize } from 'sequelize';

// Only for MySQL

const sequelize = new Sequelize('dvdrental', 'postgres', 'mysecretpassword', {
    host: '5.189.186.217',
    port: 5432,
    dialect: 'postgres',
  });
  
  export default sequelize;