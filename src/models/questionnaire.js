import { UUIDV4 } from "sequelize";
import models from ".";
 
const QUESTIONNAIRE_ID_DATA_ATTRIBUTES = ['questionnaireId']
const QUESTIONNAIRE_CONTENT_ATTRIBUTES = ['description']
const AUDIT_ATTRIBUTES = ['createdAt', 'updatedAt']

const QUESTIONNAIRE_BASIC_VIEW_DATA_ATTRIBUTES = [...QUESTIONNAIRE_ID_DATA_ATTRIBUTES, ...QUESTIONNAIRE_CONTENT_ATTRIBUTES, 'version']
const QUESTIONNAIRE_VIEW_DATA_ATTRIBUTES = [...QUESTIONNAIRE_BASIC_VIEW_DATA_ATTRIBUTES, ...AUDIT_ATTRIBUTES]

const questionnaire = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define(
    "Questionnaire",
    {
      questionnaireId: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      description: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      }
    },
    {
        schema: process.env.DATABASE_SCHEMA
    }
  )

  Questionnaire.associate = models => {
      Questionnaire.hasMany(models.Question, { as: 'questions', onDelete: 'cascade' })
  }

  Questionnaire.questionnaireBasicViewData = () => {
    return QUESTIONNAIRE_BASIC_VIEW_DATA_ATTRIBUTES
  }

  Questionnaire.questionnaireViewData = () => {
    return QUESTIONNAIRE_VIEW_DATA_ATTRIBUTES
  }

  Questionnaire.findAllQuestionnaires = async (where) => {
    return await Questionnaire.findAll({
      where,
      include: [{
          model: models.Question, 
          as: 'questions',
          attributes: models.Question.questionBasicViewDataAttributes(),
      }],
      attributes: Questionnaire.questionnaireBasicViewData(),
  })
  }

  Questionnaire.findById = async (questionnaireId) => {
    return await Questionnaire.findOne({
      where: { questionnaireId },
      include: [{
        model: models.Question,
        as: 'questions',
        attributes: models.Question.questionViewDataAttributes(),
      }]
    })
  }

  Questionnaire.createQuestionnaire = async (description, questions) => {
    return await Questionnaire.create(
      { description, questions },
      {
        include: [
          {
            model: models.Question,
            as: "questions",
            attributes: models.Question.questionViewDataAttributes(),
          },
        ],
        attributes: Questionnaire.questionnaireViewData(),
      }
    )
  }

  Questionnaire.deleteById = async (questionnaireId) => {
    return await Questionnaire.destroy({
      where: { questionnaireId }
    })
  }

  return Questionnaire
}

export default questionnaire
