import { UUIDV4 } from "sequelize";
import Entity from "./entity";
import Contact from "./contact";

const entityContact = (sequelize, DataTypes) => {
    // Defining our EntityContact object.
    const EntityContact = sequelize.define('EntityContact', {
            id: {
                type: DataTypes.UUID,
                unique: true,
                primaryKey: true,
                defaultValue: UUIDV4
            },
            entityId: {
                type: DataTypes.UUID,
            },
            contactId: {
                type: DataTypes.UUID,
            },
            relationshipTitle: {
                type: DataTypes.STRING,
                defaultValue: "default",
            }
        },
        {
            schema: process.env.DATABASE_SCHEMA
        });

    EntityContact.findAssociatedEntitiesByContactId = async (contactId) => {
        const contactEntities = await EntityContact.findAll({
            where: { contactId },
            include: [Entity]
        });

        return contactEntities;
    };

    EntityContact.findAssociatedContactsByEntityId = async (entityId) => {
        const contactEntities = await EntityContact.findAll({
            where: { entityId },
            include: [Contact]
        });

        return contactEntities;
    };

    return EntityContact;
};

export default entityContact;