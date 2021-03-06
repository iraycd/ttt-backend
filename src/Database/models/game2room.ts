import { EdgeModel } from "../../Architecture/baseMode";
import * as Joi from "joi";
import { Database } from "arangojs";

export default (db: Database) => {
  class Game2Room extends EdgeModel {
    schema = Joi.object({
      room: Joi.string().required(),
      game: Joi.string().required()
    });
    constructor() {
      super(db, "games_in_room", {
        _from: "room",
        _to: "game"
      });
    }
  }
  return Game2Room;
};
