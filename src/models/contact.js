import { UUIDV4 } from "sequelize";

const contact = (sequelize, DataTypes) => {
    // Defining our contact table and setting Contact object.
    const Contact = sequelize.define('contact', {
        contact_id: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: 'users', // 'users' refers to table name
                key: 'email', // 'id' refers to column email in persons table
            }
        },
        name : {
            type: DataTypes.STRING,
            unique: true,
            required: true
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            required: true
        },
        entity_id: {
            type: DataTypes.UUID,
        },
        email: {
            type: DataTypes.STRING,
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

    Contact.findById = async (id) => {
        const contact = await Contact.findOne({
            where: { id }
        });
        
        return contact;
    };

    Contact.findByName = async (name) => {
        const contact = await Contact.findOne({
            where: { name }
        });
        
        return contact;
    };

    Contact.findByPhone = async (phone) => {
        const contact = await Contact.findOne({
            where: { phone }
        });

        return contact;
    };

    return Contact;
};

export default contact;