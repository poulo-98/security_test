const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('security_test', 'bizao_admin', '6O5y8g0zqyuiil', {
    host: 'prod-mysql-data-01.cjixxtdzk7v0.us-east-2.rds.amazonaws.com',
    dialect: 'mysql'
});

const ClickCount = sequelize.define('ClickCount', {
    clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    } ,
    nombreChargement: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    timestamps: false
});

sequelize.sync();

module.exports = { sequelize, ClickCount };
