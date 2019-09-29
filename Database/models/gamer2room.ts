import { EdgeModel } from "../../Architecture/baseMode";
const Joi = require('@hapi/joi');


export default (db) => {
    class Game2Room extends EdgeModel {
        schema = Joi.object({
            room: Joi.string().required(),
            gamer: Joi.string().required()
        })
        constructor(){
            super(db, 'gamers_in_room',{
                _from:'room',
                _to:'gamer'
            })
        }
    }
    return Game2Room
}