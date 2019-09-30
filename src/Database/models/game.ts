import BaseModel from "../../Architecture/baseMode";
import * as Joi from "joi";
import { Database } from "arangojs";

export default (db: Database) => {
  class Game extends BaseModel {
    schema = Joi.object({
      game: Joi.string()
        .min(3)
        .max(30)
        .required(),
      maxPlayers: Joi.number().default(2), // To start the game
      minPlayers: Joi.number().default(2),
      status: Joi.string().allow("WON", "DRAWN", "STARTED"),
      firstPlayer: Joi.string(),
      winner: Joi.string(),
      hasWinner: Joi.string(),
      gameOver: Joi.boolean().default(false)
    });
    constructor() {
      super(db, "game");
    }
  }
  return Game;
};
