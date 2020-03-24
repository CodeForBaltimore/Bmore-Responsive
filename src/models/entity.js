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
        address: {
            type: DataTypes.JSON,
        },
        phone: {
            type: DataTypes.JSON,
        },
        email: {
            type: DataTypes.JSON,
        },
        checkIn: {
            type: DataTypes.JSON,
        },
        description: {
            type: DataTypes.STRING
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

    Entity.associate = models => {
        Entity.hasMany(models.Contact);
    }

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

    Entity.findContacts = async (id) => {
        const entity = await Entity.findOne({
            where: { id }
        });

        const contacts = await entity.getContacts();

        return contacts;
    }

    return Entity;
};

export default entity;