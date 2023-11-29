const Game = require("../models/game.model");
const { StatusCodes } = require("http-status-codes");

const getAllGames = async (req, res) => {
  const { userId } = req.user;
  const games = await Game.getAllGames(userId);
  return res.status(StatusCodes.OK).json({ games });
};

const getAllGamesByUserId = async (req, res) => {
  const userId = req.query.id;
  console.log(userId);
  const games = await Game.getAllGames(userId);
  return res.status(StatusCodes.OK).json({ games });
};

const getGameById = async (req, res) => {
  const { id: gameId } = req.params;
  const { userId } = req.user;
  const game = await Game.getGameById(gameId, userId);
  return res.status(StatusCodes.OK).json({ game });
};

const createGame = async (req, res) => {
  const game = await Game.createGame(req.body, req.user);
  return res
    .status(StatusCodes.OK)
    .json({ record_inserted: game.affectedRows });
};

const updateGameById = async (req, res) => {
  const { id: gameId } = req.params;
  const game = await Game.updateGameById(gameId, req.body, req.user);
  return res.status(StatusCodes.OK).json({ record_updated: game.affectedRows });
};

module.exports = {
  getAllGames,
  getAllGamesByUserId,
  getGameById,
  createGame,
  updateGameById,
};
