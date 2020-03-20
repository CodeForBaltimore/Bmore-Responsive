import { UUIDV4 } from "sequelize";

const entity = (sequelize, DataTypes) => {
    // Defining our entity table and setting Entity object.
    const Entity = sequelize.define('Entity', {
        id: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        name : {
            type: DataTypes.STRING,
            required: true
        },
        phone: {
            type: DataTypes.JSON,
        },
        email: {
            type: DataTypes.JSON,
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

    Entity.findById = async (id) => {
        const entity = await Entity.findOne({
            where: { id }
        });
        
        return entity;
    };

    Entity.findByName = async (name) => {
        const entity = await Entity.findOne({
            where: { name }
        });
        
        return entity;
    };

    return Entity;
};

export default entity;