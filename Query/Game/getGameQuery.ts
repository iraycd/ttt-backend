import { aql } from "arangojs";

interface Dependencies {
  arangoDI;
}
export default class GetGameDetailed {
  model;
  value;
  arangoDI;
  constructor({ arangoDI }: Dependencies) {
    this.model = new arangoDI.Game();
    this.arangoDI = arangoDI;
  }
  init(dto) {
    this.value = dto;
  }
  async run() {
    const { id } = this.value;
    const gameDetailQuery = aql`
            let gamers = (
                FOR value IN 1..1 INBOUND CONCAT('game/',${id}) gamers_in_game
                    RETURN value
            )
            let moves = (
                FOR m IN move
                    FILTER m.game == CONCAT(${id})
                    RETURN m
            )
            let game = DOCUMENT(CONCAT('game/',${id}))
            RETURN MERGE(game,{gamers, moves})
        `;
    const gameListQueryCursor = await this.arangoDI.db.query(gameDetailQuery);
    return gameListQueryCursor._result;
  }
}
