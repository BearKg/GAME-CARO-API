const conn = require("../db/connect");
const util = require("util");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");

const {
  hashPassword,
  comparePassword,
} = require("../middleware/hash-password");
const jwt = require("jsonwebtoken");
const { rejects } = require("assert");

const query = util.promisify(conn.query).bind(conn);

const User = {
  getUserByName: (username) => {
    new Promise(async (resolve, reject) => {
      const q = "SELECT * FROM user WHERE USERNAME = ?";
      const users = await query(q, [username]);
      if (users) {
        resolve({ msg: "Đã tồn tại user" });
      }
      reject({ msg: "not found" });
    });
  },
  getAllUsers: () =>
    new Promise(async (resolve, reject) => {
      const q = "SELECT * FROM nguoichoi ORDER BY SCORE DESC";
      const users = await query(q);
      if (!users) {
        reject(new NotFoundError("Khong tim thay nguoi choi nao!"));
      }
      resolve(users);
    }), // sort by score
  getUserById: (id) =>
    new Promise(async (resolve, reject) => {
      const q = `SELECT * FROM user WHERE ID = ?`;
      const user = await query(q, [id]);
      if (!user)
        reject(new NotFoundError(`Khong the tim thay nguoi choi co id: ${id}`));
      resolve(user);
    }),
  createUser: (user) =>
    new Promise(async (resolve, reject) => {
      const q = `CALL themnguoichoi(?, ?, ?, ?, ?, ?)`;
      const { name, username, password, email, admin } = user;

      const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
      const id = currentTimeInSeconds.toString();

      const hashPass = await hashPassword(password);
      const result = await query(q, [
        id,
        name,
        username,
        hashPass,
        email,
        admin,
      ]);
      if (!result.affectedRows)
        reject(new BadRequestError("Khong the them user!"));
      resolve(result);
    }),
  updateUserById: (id, user) =>
    new Promise(async (resolve, reject) => {
      const q = `CALL suannguoichoi(?, ?, ?, ?, ?, ?, ?)`;
      const { name, username, password, email, admin, score } = user;
      const hashPass = await hashPassword(password);
      const result = await query(q, [
        id,
        name,
        username,
        hashPass,
        email,
        admin,
        score,
      ]);
      if (!result.affectedRows)
        reject(new BadRequestError("Khong the cap nhat!"));
      resolve(result);
    }),
  deleteUser: (id) =>
    new Promise(async (resolve, reject) => {
      const q = `CALL xoanguoichoi(?)`;
      const result = await query(q, [id]);
      if (!result.affectedRows) reject(new BadRequestError("Khong the xoa!"));
      resolve(result);
    }),
  updateAllScore: () => {
    return new Promise(async (resolve, reject) => {
      const q = `UPDATE user u
      SET u.SCORE = IF(
        (SELECT SUM(g.SCORE)
        FROM game g
        WHERE g.PLAYER_ID = u.ID) > 0,
        (SELECT SUM(g.SCORE)
        FROM game g
        WHERE g.PLAYER_ID = u.ID),
        0
      )`;
      const result = await query(q);
      console.log(result);
      if (!result.affectedRows) reject(new BadRequestError("Update thất bại!"));
      resolve(result);
    });
  },
  // Da xac thuc
  updateInfo: (id, user) =>
    new Promise(async (resolve, reject) => {
      const { name, email } = user;
      const q = `
      UPDATE user 
      SET NAME = ?,
          EMAIL = ?
      WHERE ID = ? ;
      `;
      const result = await query(q, [name, email, id]);
      if (!result.affectedRows) reject(new BadRequestError("Khong the xoa!"));
      resolve(result);
    }),
  register: (user) =>
    new Promise(async (resolve, reject) => {
      const { email, username, password } = user;
      const hashPass = await hashPassword(password); // hash truoc khi luu vao db

      const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
      const ID = currentTimeInSeconds.toString();

      const q1 = `CALL dangky(?, ?, ?, ?)`;
      try {
        const result = await query(q1, [ID, email, username, hashPass]);
        if (!result.affectedRows)
          reject(new BadRequestError("Dang ky khong thanh cong!"));
        const q2 = `SELECT * FROM user WHERE ID = ?`;
        const id = ID;
        const newUser = await query(q2, [id]);
        if (!newUser)
          reject(
            new NotFoundError(`Khong the tim thay nguoi choi co id: ${id}`)
          );
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    }),
  login: (username, plaintextPassword) =>
    new Promise(async (resolve, reject) => {
      const q = `SELECT * FROM user where USERNAME = ?`;
      const user = await query(q, [username]);
      if (!user[0]) {
        reject(
          new NotFoundError(
            `Khong the tim thay nguoi choi co username: ${username}`
          )
        );
      } else {
        const password = user[0]?.PASSWORD;
        const isUser = comparePassword(plaintextPassword, password);
        if (!isUser) {
          reject(new UnauthenticatedError("Password incorrect!"));
        }
        resolve(user);
      }
    }),
  changePassword: (id, user) =>
    new Promise(async (resolve, reject) => {
      const { password } = user;
      const hashPass = await hashPassword(password);
      const q = `
      UPDATE user 
      SET password = ?
      WHERE ID = ? 
      `;
      const result = await query(q, [hashPass, id]);
      if (!result.affectedRows) reject(new BadRequestError("Khong the xoa!"));
      resolve(result);
    }),
  createJWT: function (id, username, isAdmin) {
    return (token = jwt.sign(
      { userId: id, username: username, isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    ));
  },
};

module.exports = User;
