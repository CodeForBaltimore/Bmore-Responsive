import { UUIDV4 } from "sequelize";

const QUESTION_ID_DATA_ATTRIBUTES = ['questionId']
const QUESTION_BASIC_CONTENT_ATTRIBUTES = ['questionText', 'questionType', 'required']
const QUESTION_CONTENT_ATTRIBUTES = [...QUESTION_BASIC_CONTENT_ATTRIBUTES, 'options', 'allowOther']
const AUDIT_DATA_ATTRIBUTES = ['createdAt', 'updatedAt']

const QUESTION_BASIC_VIEW_DATA_ATTRIBUTES = [...QUESTION_ID_DATA_ATTRIBUTES, ...QUESTION_BASIC_CONTENT_ATTRIBUTES]
const QUESTION_VIEW_DATA_ATTRIBUTES = [...QUESTION_ID_DATA_ATTRIBUTES, ...QUESTION_CONTENT_ATTRIBUTES, ...AUDIT_DATA_ATTRIBUTES]

const question = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      questionId: {
        type: DataTypes.UUID,
        unque: true,
        primaryKey: true,
        defaultValue: UUIDV4,
      },
      questionText: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        validate: {
          min: {
            args: [3],
            msg: "Question must be at least 3 characters long" 
          },
          max: {
            args: [1024],
            msg: "Question cannot be longer than 1024 characters"
          }
        }
      },
      questionType: {
        type: DataTypes.ENUM(
          "informational",
          "boolean",
          "short-text",
          "long-text",
          "single-select",
          "multi-select"
          ),
          required: true,
          allowNull: false,
      },
      required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        // TODO 
        // "items": {
        //   "description": "The values to display as potential answers for a question. Values can only be \nprovided for boolean, single-selct or multi-select question types.",
        //   "uniqueItems": true,
        //   "maxItems": 16,
        //   "type": "string"
        // }
      },
      allowOther: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      schema: process.env.DATABASE_SCHEMA,
    }
  )

  Question.questionBasicViewDataAttributes = () => {
    return QUESTION_BASIC_VIEW_DATA_ATTRIBUTES
  }

  Question.questionViewDataAttributes = () => {
    return QUESTION_VIEW_DATA_ATTRIBUTES
  }


  return Question
}

export default question
