import BaseModel from "../../Architecture/baseMode";
const Joi = require('@hapi/joi');


export default (db) => {
    class Game extends BaseModel {
        schema = Joi.object({
            game: Joi.string()
                .min(3)
                .max(30)
                .required(),
            maxPlayers: Joi.number().default(2), // To start the game
            minPlayers: Joi.number().default(2),
            status: Joi.string().allow('WON', 'DRAWN'),
            winner: Joi.string(),
            hasWinner: Joi.string(),
            gameOver: Joi.boolean(),
            firstPlayer: Joi.string(),
        })
        constructor(){
            super(db, 'game')
        }
    }
    return Game
}