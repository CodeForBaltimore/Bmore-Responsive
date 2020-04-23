import { UUIDV4 } from "sequelize";
import Contact from "./contact";
import EntityContact from "./entitycontact";

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
        type : {
            type: DataTypes.STRING
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
        },
        attributes: {
            type: DataTypes.JSON,
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

    Entity.associate = models => {
        Entity.belongsToMany(models.Contact, {
            through: "EntityContacts",
            as: "contacts",
            foreignKey: "entityId",
            otherKey: "contactId"
        });
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

    Entity.findAssociatedContactsByEntityId = async (entityId) => {
        const entityContacts = await Entity.findAll({
            where: { id: entityId },
            include: [{
                model: Contact,
                as: 'contacts',
                required: false,
                attributes: ["name", "phone", "email", "attributes", "email"],
                through: {
                    model: EntityContact,
                    as: "entityContacts",
                    attributes: ["relationshipTitle"]
                }
            }]
        });

        return entityContacts;
    };

    return Entity;
};

export default entity;