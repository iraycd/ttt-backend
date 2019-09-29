import { EdgeModel } from "../../Architecture/baseMode";
const Joi = require('@hapi/joi');


export default (db) => {
    class Game2Room extends EdgeModel {
        schema = Joi.object({
            gamer: Joi.string().required(),
            game: Joi.string().required()
        })
        constructor(){
            super(db, 'gamers_in_game',{
                _from:'gamer',
                _to:'game'
            })
        }
    }
    return Game2Room
}