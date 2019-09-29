import BaseModel from "../../Architecture/baseMode";
import * as Joi from "joi";

export default db => {
  class Room extends BaseModel {
    schema = Joi.object({
      room: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      code: Joi.string()
    });

    constructor() {
      super(db, "room");
    }
  }
  return Room;
};
