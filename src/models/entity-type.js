const entityType = (sequelize, DataTypes) => {
  const EntityType = sequelize.define('EntityType', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      required: true
    },
    description: {
      type: DataTypes.STRING
    },
    questionnaires: {
      type: DataTypes.JSON
    }
  },
    {
      schema: process.env.DATABASE_SCHEMA
    })

    EntityType.findById = async (id) => {
      const entityType = await EntityType.findOne({
        where: { id }
      })

      return entityType
    }

    EntityType.findByName = async (name) => {
      const entityType = await EntityType.findOne({
        where: { name }
      })

      return entityType
    }

  return EntityType
}

export default entityType
