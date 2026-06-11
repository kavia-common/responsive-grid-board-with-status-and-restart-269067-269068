import React, { useMemo, useState } from "react";

/**
 * Winning line indices for a 3x3 tic tac toe board.
 * @type {number[][]}
 */
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * @param {(null|"X"|"O")[]} squares
 * @returns {{winner: (null|"X"|"O"), winningLine: (null|number[])}}
 */
function calculateWinner(squares) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: line };
    }
  }
  return { winner: null, winningLine: null };
}

/**
 * @param {(null|"X"|"O")[]} squares
 * @returns {boolean}
 */
function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

/**
 * Square button component.
 * @param {{
 *  value: (null|"X"|"O"),
 *  onClick: () => void,
 *  isWinning: boolean,
 *  disabled: boolean,
 *  index: number
 * }} props
 */
function Square({ value, onClick, isWinning, disabled, index }) {
  return (
    <button
      type="button"
      className={[
        "ttt-square",
        value ? `ttt-square--${value}` : "",
        isWinning ? "ttt-square--winning" : "",
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square ${index + 1}, ${value}` : `Square ${index + 1}, empty`}
    >
      {value ? <span className="ttt-mark">{value}</span> : null}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Board state: 9 squares for 3x3 grid. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** True if X's turn, false if O's turn. */
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, winningLine } = useMemo(() => calculateWinner(squares), [squares]);

  const isDraw = !winner && isBoardFull(squares);
  const gameOver = Boolean(winner) || isDraw;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw — nobody wins";
    return `Next player: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  /**
   * Handle user click on a square. No-op if square filled or game over.
   * @param {number} idx
   */
  function handleSquareClick(idx) {
    if (gameOver) return;
    if (squares[idx] !== null) return;

    const next = squares.slice();
    next[idx] = xIsNext ? "X" : "O";

    setSquares(next);
    setXIsNext((v) => !v);
  }

  /**
   * Reset the game state to initial.
   */
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="ttt-page">
      <main className="ttt-card" aria-label="Tic Tac Toe game">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Local two-player • Responsive board</p>
        </header>

        <section className="ttt-status" aria-live="polite" aria-atomic="true">
          <span className={["ttt-statusText", winner ? "ttt-statusText--winner" : ""].join(" ")}>
            {statusText}
          </span>
        </section>

        <section className="ttt-boardWrap" aria-label="Game board">
          <div className="ttt-board" role="grid" aria-label="3 by 3 game board">
            {squares.map((value, idx) => (
              <Square
                key={idx}
                value={value}
                index={idx}
                isWinning={Boolean(winningLine && winningLine.includes(idx))}
                disabled={gameOver || value !== null}
                onClick={() => handleSquareClick(idx)}
              />
            ))}
          </div>
        </section>

        <footer className="ttt-footer">
          <button type="button" className="ttt-restartBtn" onClick={handleRestart}>
            Restart
          </button>

          <div className="ttt-help">
            <span className="ttt-helpLabel">Tip:</span> Try to line up 3 marks in a row.
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
