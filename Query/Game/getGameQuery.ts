import * as builder from 'mongo-aql';
import { aql } from 'arangojs';

interface Dependencies {arangoDI}
export default class GetGameDetailed {
    model
    value
    arangoDI
    constructor({arangoDI}:Dependencies) {
        this.model = new arangoDI.Game()
        this.arangoDI = arangoDI
    };
    init(dto) {
        this.value = dto
    }
    async run() {
        const {id} = this.value
        const gameDetailQuery =  aql`
            let gamer = (
                FOR value IN 1..1 INBOUND "game/${id}" gamers_in_game
                    RETURN value
            )
            let move = (
                FOR m IN move
                    FILTER m.game == "${id}"
                    RETURN m
            )
            let game = DOCUMENT("game/${id}")
            RETURN MERGE(game, {gamer, move})
        `
        const gameListQueryCursor = await this.arangoDI.db.query(gameDetailQuery)
        return gameListQueryCursor._result
    }
};