const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('security_test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const ClickCount = sequelize.define('ClickCount', {
    clicks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    timestamps: false
});

sequelize.sync();

module.exports = { sequelize, ClickCount };
