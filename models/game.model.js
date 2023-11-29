const conn = require("../db/connect");
const util = require("util");
const { NotFoundError, BadRequestError } = require("../errors");

const query = util.promisify(conn.query).bind(conn);

const Game = {
  getAllGames: (userId) =>
    new Promise(async (resolve, reject) => {
      const q =
        "SELECT * FROM banchoi WHERE PLAYER_ID = ? ORDER BY start_time DESC";
      const games = await query(q, [userId]);
      if (!games) reject(new NotFoundError("Khong tim duoc van dau"));
      resolve(games);
    }),
  getGameById: (gameId, userId) =>
    new Promise(async (resolve, reject) => {
      const q = `SELECT * FROM banchoi WHERE PLAYER_ID = ? AND ID = ?`;
      const game = await query(q, [userId, gameId]);
      if (!game)
        reject(new NotFoundError(`Khong the tim thay nguoi choi co id: ${id}`));
      resolve(game);
    }),
  createGame: (game, user) =>
    new Promise(async (resolve, reject) => {
      const q = `CALL thembanchoi(?,?,?,?,?,?,?,?,?,?,?)`;
      const { userId } = user; // req.user
      const {
        opponent_name,
        score,
        game_type,
        difficulty,
        play_time,
        start_time,
        status,
        data,
        nextmove,
        ID,
      } = game;
      const result = await query(q, [
        ID,
        userId,
        opponent_name,
        score,
        game_type,
        difficulty,
        play_time,
        start_time,
        status,
        data,
        nextmove,
      ]);
      if (!result.affectedRows) reject(new BadRequestError("Can not insert!"));
      resolve(result);
    }),
  updateGameById: (gameId, game, user) =>
    new Promise(async (resolve, reject) => {
      const { userId } = user;
      const { score, play_time, status, data, nextmove } = game; //req.body
      const q = `CALL suabanchoi(?,?,?,?,?,?,?)`;
      const result = await query(q, [
        gameId,
        userId,
        score,
        play_time,
        status,
        data,
        nextmove,
      ]);
      if (!result.affectedRows) reject(new BadRequestError("Can not update!"));
      resolve(result);
    }),
};

module.exports = Game;
