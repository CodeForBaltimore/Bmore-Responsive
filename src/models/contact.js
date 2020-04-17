import { UUIDV4 } from "sequelize";

const contact = (sequelize, DataTypes) => {
    // Defining our contact table and setting Contact object.
    const Contact = sequelize.define('Contact', {
        id: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        UserId: {
            type: DataTypes.UUID,
            references: {
                model: 'User',
                key: 'id', 
            },
            unique: true
        },
        EntityId: {
            type: DataTypes.UUID,
            references: {
                model: 'Entity',
                key: 'id'
            }
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
        },
        attributes: {
            type: DataTypes.JSON,
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

    Contact.associate = models => {
        Contact.belongsTo(models.User);
        Contact.belongsTo(models.Entity);
    }

    Contact.findById = async (id) => {
        const contact = await Contact.findOne({
            where: { id }
        });
        
        return contact;
    };

    Contact.findByUserId = async (UserId) => {
        const contact = await Contact.findOne({
            where: { UserId }
        });
        
        return contact.dataValues;
    }

    Contact.findByName = async (name) => {
        const contact = await Contact.findOne({
            where: { name }
        });
        
        return contact;
    };

    return Contact;
};

export default contact;