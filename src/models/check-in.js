import { UUIDV4 } from "sequelize";

const checkIn = (sequelize, DataTypes) => {
    // Defining our checkIn table and setting CheckIn object.
    const CheckIn = sequelize.define('CheckIn', {
        id: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        UserId: {
            type: DataTypes.STRING,
            references: {
                model: 'User',
                key: 'id', 
            }
        },
        ContactId: {
            type: DataTypes.STRING,
            references: {
                model: 'Contact',
                key: 'id', 
            }
        },
        EntityId: {
            type: DataTypes.STRING,
            references: {
                model: 'Entity',
                key: 'id', 
            }
        },
        notes: {
            type: DataTypes.JSON,
        },
        history: {
            type: DataTypes.JSON
        }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    });

    CheckIn.associations = models => {
        CheckIn.belongsTo(models.User);
        CheckIn.belongsTo(models.Contact);
        CheckIn.belongsTo(models.Entity);
    }

    CheckIn.findById = async (id) => {
        const checkIn = await CheckIn.findOne({
            where: { id }
        });
        
        return checkIn;
    };

    CheckIn.findByName = async (name) => {
        const checkIn = await CheckIn.findOne({
            where: { name }
        });
        
        return checkIn;
    };

    return CheckIn;
};

export default checkIn;