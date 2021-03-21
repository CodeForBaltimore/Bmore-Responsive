import { Router } from "express";
import utils from "../utils";
var Sequelize = require("sequelize");
import models from "../models";
import validator from "validator";
import question from "../models/question";

const router = new Router();
// router.use(utils.authMiddleware)

router.get("/", async (req, res) => {
  // return all questionnaires matching request query
  req.context.models.Questionnaire.findAllQuestionnaires(req.query)
    .then((questionnaires) => {
      return res.status(200).send(questionnaires);
    })
    .catch((e) => {
      console.error(e);
      return sendResponse(res, 500);
    });
});

router.get("/:questionnaireId", async (req, res) => {
  const questionnaireId = req.params.questionnaireId;
  // if given questionnaireId is not a valid UUID, return 400
  if (!validator.isUUID(questionnaireId)) {
    return res.status(400).send({ code: 400, message: "Invalid UUID" });
  }

  req.context.models.Questionnaire.findById(questionnaireId)
    .then((questionnaire) => {
      // if didn't find questionnaire with given uuid, return 404
      if (!questionnaire) {
        return sendResponse(res, 404);
      }

      // if found questionnaire with given uuid, return questionnaire
      return res.status(200).send(questionnaire);
    })
    .catch((e) => {
      console.error(e);
      return sendResponse(res, 500);
    });
});

router.post("/", async (req, res) => {
  const { description, questions } = req.body;
  req.context.models.Questionnaire.createQuestionnaire(description, questions)
    .then((questionnaire) => {
      res.set({
        Location: `${req.protocol}://${req.get("host")}/questionnaire/${
          questionnaire.questionnaireId
        }`,
      });
      return res.status(201).send(questionnaire);
    })
    .catch(Sequelize.ValidationError, (e) => {
      console.error(e);
      let msg = {
        errors: [],
      };
      e.errors.map((err) => {
        msg.errors.push(err.message);
      });
      return res.status(400).send(msg);
    })
    .catch((e) => {
      console.error(e);
      return sendResponse(res, 500);
    });
});

router.delete("/:questionnaireId", async (req, res) => {
  const questionnaireId = req.params.questionnaireId;
  // if given questionnaireId is not a valid UUID, return 400
  if (!validator.isUUID(questionnaireId)) {
    return res.status(400).send({ code: 400, message: "Invalid UUID" });
  }

  req.context.models.Questionnaire.deleteById(questionnaireId)
    .then((rowsNum) => {
      if (rowsNum === 0) {
        return sendResponse(res, 404);
      }

      return sendResponse(res, 204);
    })
    .catch((e) => {
      console.error(e);
      return sendResponse(res, 500);
    });
});

function sendResponse(res, code) {
  const response = new utils.Response();
  response.setCode(code);
  return res
    .status(response.getCode())
    .send({ code: response.getCode(), message: response.getMessage() });
}

export default router;
