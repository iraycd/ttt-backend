import BaseModel from "../../Architecture/baseMode";
import * as Joi from "joi";
import { Database } from "arangojs";

export default (db: Database) => {
  class Move extends BaseModel {
    schema = Joi.object({
      game: Joi.string().required(),
      gamer: Joi.string().required(),
      row: Joi.number()
        .min(0)
        .required(),
      col: Joi.number()
        .max(2)
        .required()
    });

    constructor() {
      super(db, "move");
    }
  }
  return Move;
};
