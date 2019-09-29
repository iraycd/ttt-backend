import * as R  from 'ramda';
import { DocumentCollection } from "arangojs"
import { NotFound, BadRequest, NotExtended } from 'fejl'
import { hasWon, isDraw } from '../../Helpers/gameHelper';
import * as builder from 'mongo-aql';


interface Dependencies {arangoDI}
export default class MakeMoveCommand {
    model
    value
    modelName
    arangoDI
    gameModel
    gamerModel
    constructor({arangoDI}:Dependencies) {
        this.arangoDI = arangoDI
        this.model = new arangoDI.Move()
        this.gameModel = new arangoDI.Game()
        this.gamerModel = new arangoDI.Gamer()
        this.modelName = this.model.model
    };
    init(dto) {
        this.value = dto
    }

    canMakeMove(moves, presentGamer, initialGamer){
        const byGamer = R.groupBy(function(move) {
            const gamer = move.gamer;
            return gamer
        });
        const games = byGamer(moves)
        const gamerMover = R.keys(games)

        if(moves.length == 1){
            return gamerMover.indexOf(presentGamer) === -1
        }
        let canMoveValidation
        // If present gamer is initial gamer
        if(presentGamer == initialGamer){
            for(let i = 0; i<gamerMover.length; i++){
                const move = gamerMover[i]
                canMoveValidation = games[move].length >= games[presentGamer].length
                if(!canMoveValidation) break;
            }
        }else { // Other
           canMoveValidation = games[presentGamer].length < games[initialGamer].length
        }
        return canMoveValidation
    }


    checkWinner(board, gamer){
        let hasWinner = true;
        let winner = null;
        let gameOver = false;
        if (hasWon(board, gamer)) {
            winner = gamer;
            gameOver = true;
        } else if (isDraw(board)) {
            winner = null;
            gameOver = true;
        } else {
            hasWinner = false;
        }
        return {hasWinner, winner, gameOver};
    };

    checkBoard(moves){
        let board =  [
            [undefined,undefined,undefined],
            [undefined,undefined,undefined],
            [undefined,undefined,undefined]
        ]
        moves.map(move=>{
            board[move.col][move.row] = move.gamer
        })
        return board
    }

    async run() {
        const moveModel:DocumentCollection = this.model.collection

        // Get the gamer
        const gamerValue = await this.gamerModel.get( this.value.gamer )
        BadRequest.assert(gamerValue, "Gamer is not found")
        const gamer = gamerValue._key


        // Get the game
        const gameValue = await this.gameModel.get( this.value.game )
        BadRequest.assert(gameValue, "Game is not found")
        BadRequest.assert(!gameValue.gameOver, `Game over`)
        const initialGamer = gameValue.firstPlayer

        // Check if the gamer belongs to the game.
        const gamerInGameCheck = builder('gamers_in_game', {_from:gamerValue._id, _to:gameValue._id})
        const gamerInGameCheckQueryCursor = await this.arangoDI.db.query(gamerInGameCheck.query, gamerInGameCheck.values)
        NotFound.assert(gamerInGameCheckQueryCursor._result.length > 0, "Gamer does not exist in the game")

        // Check if the gamer belongs to the game.
        const gamerCountInGameCheck = builder('gamers_in_game', {_to:gameValue._id})
        const gamerCountInGameCheckCursor = await this.arangoDI.db.query(gamerCountInGameCheck.query, gamerCountInGameCheck.values)
        NotFound.assert(gamerCountInGameCheckCursor._result.length <= gameValue.minPlayers, "Not enough gamers to start the game")


        // Validate if the move was not already used
        const moveExistingCheckQuery = builder('move', {game:gameValue._key, row: this.value.row, col: this.value.col})
        const moveExistingCheckQueryCursor = await this.arangoDI.db.query(moveExistingCheckQuery.query, moveExistingCheckQuery.values)
        NotFound.assert(moveExistingCheckQueryCursor._result.length == 0, "Move already registered")

        // Check if it's the correct player who has made the move.
        const gameMoveQuery = builder('move', {game:gameValue._key})
        const gameMoveQueryCursor = await this.arangoDI.db.query(gameMoveQuery.query, gameMoveQuery.values)
        const moves = gameMoveQueryCursor._result
        if(initialGamer && moves.length > 0){
            const makeMove = this.canMakeMove(moves, gamerValue._key, initialGamer)
            NotFound.assert(makeMove, "Cannot make any move")
        }else{
            await this.gameModel.update(gameValue._key, {firstPlayer: gamerValue._key})
        }
        // Check the game
        await this.model.save(this.value)
        const newGameMoveQueryCursor = await this.arangoDI.db.query(gameMoveQuery.query, gameMoveQuery.values)
        const newMoves = newGameMoveQueryCursor._result
        const board = this.checkBoard(newMoves)
        const { hasWinner, winner, gameOver} = this.checkWinner(board,gamer)
        await this.gameModel.update(gameValue._key, { hasWinner, winner, gameOver})
    }
};