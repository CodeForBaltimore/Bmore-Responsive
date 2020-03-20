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
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: 'User',
                key: 'id', 
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
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

    Contact.associate = models => {
        Contact.belongsTo(models.User);
    }

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

    // Contact.findByPhone = async (phone) => {
    //     const contact = await Contact.findOne({
    //         where: { phone }
    //     });

    //     return contact;
    // };

    return Contact;
};

export default contact;