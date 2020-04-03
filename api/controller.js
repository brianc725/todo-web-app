const router = require("express").Router();
const db = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

// status
const SUCCESSFUL = { status: "success" };

// errors
const ERROR_USER_TAKEN = { status: "error", error: "Username already taken." };
const ERROR_USER_NO_EXIST = {
  status: "error",
  error: "Username does not exist."
};
const ERROR_PASSWORD = {
  status: "error",
  error: "Invalid password."
};
const ERROR_MISSING_FIELD = {
  status: "error",
  error: "Not all fields are filled out."
};
const ERROR_BCRYPT = {
  status: "error",
  error: "Error with bcrypt salting."
};
const ERROR_HASHING = {
  status: "error",
  error: "Error with password hashing."
};
const ERROR_SAVING = {
  status: "error",
  error: "Error saving."
};
const ERROR_TOKEN = {
  status: "error",
  error: "Token is not valid or not authorized."
};

// Middleware function to verify if user is authenticated or not
function isAuthenticated(req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token)
    return res
      .status(401)
      .send(JSON.stringify(ERROR_TOKEN))
      .end();

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    // User not authorized
    return res
      .status(401)
      .send(JSON.stringify(ERROR_TOKEN))
      .end();
  }
}

// GET - get all users
router.get("/users", async (req, res) => {
  try {
    let rows = await db.getAllUsers();
    res.send(JSON.stringify(rows)).end();
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify(err))
      .end();
  }
});

// POST - login user
router.post("/users/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res
        .status(400)
        .send(JSON.stringify(ERROR_MISSING_FIELD))
        .end();
      return;
    }

    username = username.toLowerCase();

    let user = await db.getUserByName(username);
    if (user === undefined) {
      // Username does not exist
      res
        .status(400)
        .send(JSON.stringify(ERROR_USER_NO_EXIST))
        .end();
      return;
    } else {
      const validAuth = await bcrypt.compare(password, user.password);
      if (!validAuth) {
        res
          .status(400)
          .send(JSON.stringify(ERROR_PASSWORD))
          .end();
        return;
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: 3600
      });

      const newUser = {
        id: user.id,
        username,
        token
      };

      res.send(JSON.stringify(newUser)).end();
    }
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify(err))
      .end();
  }
});

// POST - add a new user
router.post("/users/register", async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.toLowerCase();

    if (!username || !password) {
      res
        .status(400)
        .send(JSON.stringify(ERROR_MISSING_FIELD))
        .end();
      return;
    }

    let user = await db.getUserByName(username);
    if (user === undefined) {
      // Username is available

      const salt = await bcrypt.genSalt(10);
      if (!salt) {
        res
          .status(400)
          .send(JSON.stringify(ERROR_BCRYPT))
          .end();
        return;
      }

      const hashedPassword = await bcrypt.hash(password, salt);
      if (!hashedPassword) {
        res
          .status(400)
          .send(JSON.stringify(ERROR_HASHING))
          .end();
        return;
      }

      let id = await db.addUser(username, hashedPassword);
      if (!id) {
        res
          .status(400)
          .send(JSON.stringify(ERROR_SAVING))
          .end();
        return;
      }

      const token = jwt.sign({ id: id }, JWT_SECRET, {
        expiresIn: 3600
      });

      const newUser = {
        id,
        username,
        token
      };

      res.send(JSON.stringify(newUser)).end();
    } else {
      res
        .status(400)
        .send(JSON.stringify(ERROR_USER_TAKEN))
        .end();
    }
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify(err))
      .end();
  }
});

// GET - get all tasks created by this user
// PRIVATE route for specific user
router.get("/tasks/:username", isAuthenticated, async (req, res) => {
  let { username } = req.params;
  username = username.toLowerCase();

  if (!username) {
    res
      .status(400)
      .send(JSON.stringify(ERROR_MISSING_FIELD))
      .end();
    return;
  }

  try {
    // Check user existence first
    let user = await db.getUserByName(username);
    if (user === undefined) {
      // Username does not exist
      res
        .status(400)
        .send(JSON.stringify(ERROR_USER_NO_EXIST))
        .end();
    } else {
      let rows = await db.getTodosForName(username);
      res.send(JSON.stringify(rows)).end();
    }
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify(err))
      .end();
  }
});

// POST - add new task for this user
// PRIVATE route for specific user
router.post("/tasks/:username/add", isAuthenticated, async (req, res) => {
  let { username } = req.params;
  const { message, completed } = req.body;

  if (!username || !message || completed === undefined) {
    res
      .status(400)
      .send(JSON.stringify(ERROR_MISSING_FIELD))
      .end();
    return;
  }

  username = username.toLowerCase();

  try {
    // check to make sure user exists first
    let user = await db.getUserByName(username);
    if (user === undefined) {
      // Username does not exist
      res
        .status(400)
        .send(JSON.stringify(ERROR_USER_NO_EXIST))
        .end();
    } else {
      await db.addTodosForName(message, username, completed);

      // TODO: RESPOND HERE WITH THE NEW MESSAGE

      res.send(JSON.stringify(SUCCESSFUL)).end();
    }
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify(err))
      .end();
  }
});

// /tasks/:username/edit/:tid

// /tasks/:username/:tid

module.exports = router;
