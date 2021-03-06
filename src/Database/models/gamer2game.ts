import { EdgeModel } from "../../Architecture/baseMode";
import * as Joi from "joi";
import { Database } from "arangojs";

export default (db: Database) => {
  class Game2Room extends EdgeModel {
    schema = Joi.object({
      gamer: Joi.string().required(),
      game: Joi.string().required()
    });
    constructor() {
      super(db, "gamers_in_game", {
        _from: "gamer",
        _to: "game"
      });
    }
  }
  return Game2Room;
};
