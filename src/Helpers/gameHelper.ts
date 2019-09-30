export type Gamer = string;
export type Board = Array<Array<Gamer>>;

const gameIsWonBy = [
  // rows
  [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
  [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
  [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],
  // crosses
  [{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],
  [{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],
  // columns
  [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],
  [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],
  [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }]
];

const hasWon = (board: Board, gamer: Gamer): boolean => {
  return gameIsWonBy.some(pattern =>
    pattern.every(square => {
      const { r, c } = square;
      return board[r][c] === gamer;
    })
  );
};

const isDraw = (board: Board): boolean => {
  const notDraw = board.some(row => row.some(col => col === undefined));
  return !notDraw;
};

export { hasWon, isDraw };
