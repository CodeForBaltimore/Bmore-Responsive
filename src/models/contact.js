const contact = (sequelize, DataTypes) => {
    // Defining our contact table and setting Contact object.
    const Contact = sequelize.define('contact', {
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
        user_id: {
            type: DataTypes.UUID,
            // references: {
            //     model: 'users', // 'users' refers to table name
            //     key: 'id', // 'id' refers to column name in persons table
            // }
        },
        entity_id: {
            type: DataTypes.UUID,
            // references: {
            //     model: 'entities',
            //     key: 'id'
            // }
        },
        email: {
            type: DataTypes.STRING,
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

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