import { EdgeModel } from "../../Architecture/baseMode";
import * as Joi from "joi";
import { Database } from "arangojs";

export default (db: Database) => {
  class Game2Room extends EdgeModel {
    schema = Joi.object({
      room: Joi.string().required(),
      gamer: Joi.string().required()
    });
    constructor() {
      super(db, "gamers_in_room", {
        _from: "room",
        _to: "gamer"
      });
    }
  }
  return Game2Room;
};
