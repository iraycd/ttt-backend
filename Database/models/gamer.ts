import BaseModel from "../../Architecture/baseMode";
import * as Joi from "joi";

export default db => {
  class Gamer extends BaseModel {
    schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
    });

    constructor() {
      super(db, "gamer");
    }
  }
  return Gamer;
};
