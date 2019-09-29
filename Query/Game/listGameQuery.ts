import * as builder from 'mongo-aql';

interface Dependencies {arangoDI}
export default class ListGameQuery {
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
        const gameListQuery = builder('game', { "$limit": 100})
        const gameListQueryCursor = await this.arangoDI.db.query(gameListQuery.query, gameListQuery.values)
        return gameListQueryCursor._result
    }
};