const userRole = (sequelize, DataTypes) => {
    // Defining our userRole table and setting UserRole object.
    const UserRole = sequelize.define('casbin_rules', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        ptype: {
            type: DataTypes.STRING
        },
        v0: {
            type: DataTypes.STRING
        },
        v1: {
            type: DataTypes.STRING
        },
        v2: {
            type: DataTypes.STRING
        },
        v3: {
            type: DataTypes.STRING
        },
        v4: {
            type: DataTypes.STRING
        },
        v5: {
            type: DataTypes.STRING
        },
    },
        {
            schema: process.env.DATABASE_SCHEMA
        })

    return UserRole
}

export default userRole
