require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
require("dotenv").config();
//db
const connection = require("./db/connect");
const query = require("./db/query");
const dbconfig = require("./dbconfig");
//security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
//router
const userRouter = require("./routes/user.route");
const gameRouter = require("./routes/game.route");
const authRouter = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticate = require("./middleware/authenticate");

//cookie
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(cookieParser());
app.use(
  session({
    secret: "sceret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://caro-game-client.vercel.app"],
  })
);
app.use(xss());

app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/game", authenticate, gameRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
