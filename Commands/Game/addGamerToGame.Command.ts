import * as builder from 'mongo-aql'
import { NotFound } from 'fejl'

interface Dependencies {arangoDI}
export default class AddGamerToGameCommand {
    model
    value
    arangoDI
    gameModel
    constructor({arangoDI}:Dependencies) {
        this.model = new arangoDI.Gamer2Game()
        this.gameModel = new arangoDI.Game()
        this.arangoDI = arangoDI
    };
    init(dto) {
        this.value = dto
    }
    async run() {
        const gameValue = await this.gameModel.get( this.value.game )

        // Check if the gamer belongs to the game.
        const gamerInGameCheck = builder('gamers_in_game', {_from:`gamer/${this.value.gamer}`, _to:`game/${this.value.game}`})
        const gamerInGameCheckQueryCursor = await this.arangoDI.db.query(gamerInGameCheck.query, gamerInGameCheck.values)
        NotFound.assert(gamerInGameCheckQueryCursor._result.length < 1, "Gamer already exist in the game")

        // Total gamers in game
        const gamerCountInGameCheck = builder('gamers_in_game', {_to:`game/${this.value.game}`})
        const gamerCountInGameCheckQueryCursor = await this.arangoDI.db.query(gamerCountInGameCheck.query, gamerCountInGameCheck.values)
        NotFound.assert(gamerCountInGameCheckQueryCursor._result.length < gameValue.maxPlayers, "Max. Limit has been reached")
        await this.model.link(this.value)
        await this.gameModel.update(gameValue._key, { status:'STARTED'})
    }
};