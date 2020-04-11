const router = require("express").Router();
const db = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

// success
const SUCCESS_DELETE = {
  status: "Successful deletion."
};

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
const ERROR_USER_SELECT = {
  status: "error",
  error: "Chosen username does not fit proper parameters."
};
const ERROR_PW_SELECT = {
  status: "error",
  error: "Chosen password does not fit proper parameters."
}

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

// POST - login user
router.post("/users/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send(JSON.stringify(ERROR_MISSING_FIELD))
        .end();
    }

    username = username.toLowerCase();

    let user = await db.getUserByName(username);
    if (user === undefined) {
      // Username does not exist
      return res
        .status(400)
        .send(JSON.stringify(ERROR_USER_NO_EXIST))
        .end();
    } else {
      const validAuth = await bcrypt.compare(password, user.password);
      if (!validAuth) {
        return res
          .status(400)
          .send(JSON.stringify(ERROR_PASSWORD))
          .end();
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
      .send(JSON.stringify({ status: "error", error: err.toString() }))
      .end();
  }
});

// POST - add a new user
router.post("/users/register", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send(JSON.stringify(ERROR_MISSING_FIELD))
        .end();
    }
    
    username = username.toLowerCase();
    
    // Server side validation of username and password first
    const usernameRegex = /^[A-Za-z0-9]{5,30}$/;
    if (username.match(usernameRegex) === null) {
      return res
        .status(400)
        .send(JSON.stringify(ERROR_USER_SELECT))
        .end();
    }
    
    if (username === password.toLowerCase() || password.length < 8 || password.length > 30) {
      return res
        .status(400)
        .send(JSON.stringify(ERROR_PW_SELECT))
        .end();
    }

    let user = await db.getUserByName(username);
    if (user === undefined) {
      // Username is available

      const salt = await bcrypt.genSalt(10);
      if (!salt) {
        return res
          .status(400)
          .send(JSON.stringify(ERROR_BCRYPT))
          .end();
      }

      const hashedPassword = await bcrypt.hash(password, salt);
      if (!hashedPassword) {
        return res
          .status(400)
          .send(JSON.stringify(ERROR_HASHING))
          .end();
      }

      let id = await db.addUser(username, hashedPassword);
      if (!id) {
        return res
          .status(400)
          .send(JSON.stringify(ERROR_SAVING))
          .end();
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
      .send(JSON.stringify({ status: "error", error: err.toString() }))
      .end();
  }
});

// GET - get all todos created by this user
// PRIVATE route for specific user
router.get("/todos/:username", isAuthenticated, async (req, res) => {
  let { username } = req.params;
  username = username.toLowerCase();

  if (!username) {
    return res
      .status(400)
      .send(JSON.stringify(ERROR_MISSING_FIELD))
      .end();
  }

  const decodedId = req.user.id;

  try {
    // Check user existence first
    let user = await db.getUserByName(username);
    if (user === undefined) {
      // Username does not exist
      res
        .status(400)
        .send(JSON.stringify(ERROR_USER_NO_EXIST))
        .end();
    } else if (user.id !== decodedId) {
      // Username decoded token does not match this user
      res
        .status(400)
        .send(JSON.stringify(ERROR_TOKEN))
        .end();
    } else {
      let rows = await db.getTodosForName(username);
      res.send(JSON.stringify(rows)).end();
    }
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify({ status: "error", error: err.toString() }))
      .end();
  }
});

// POST - add new todo for this user
// PRIVATE route for specific user
router.post("/todos/:username/add", isAuthenticated, async (req, res) => {
  let { username } = req.params;
  const { message, completed } = req.body;

  const decodedId = req.user.id;

  if (!username || !message || completed === undefined) {
    return res
      .status(400)
      .send(JSON.stringify(ERROR_MISSING_FIELD))
      .end();
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
    } else if (user.id !== decodedId) {
      // Username decoded token does not match this user
      res
        .status(400)
        .send(JSON.stringify(ERROR_TOKEN))
        .end();
    } else {
      let id = await db.addTodosForName(message, username, completed);
      if (!id) {
        return res
          .status(400)
          .send(JSON.stringify(ERROR_SAVING))
          .end();
      }

      const msg = {
        id,
        username,
        message,
        completed
      };

      res.send(JSON.stringify(msg)).end();
    }
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify({ status: "error", error: err.toString() }))
      .end();
  }
});

// POST - Edit a specific todo id
// PRIVATE route for specific user
router.post("/todos/:username/edit/:id", isAuthenticated, async (req, res) => {
  let { username, id } = req.params;
  const { message, completed } = req.body;

  if (!username || !message || !id || completed === undefined) {
    return res
      .status(400)
      .send(JSON.stringify(ERROR_MISSING_FIELD))
      .end();
  }

  const decodedId = req.user.id;

  username = username.toLowerCase();

  try {
    let user = await db.getUserByName(username);
    if (user.id !== decodedId) {
      // Username decoded token does not match this user
      return res
        .status(400)
        .send(JSON.stringify(ERROR_TOKEN))
        .end();
    }

    const todo = await db.getTodosById(id);
    // Ensure that this todo is accessible by this user
    if (!todo || todo.length === 0 || todo[0].username !== username) {
      return res
        .status(401)
        .send(JSON.stringify(ERROR_TOKEN))
        .end();
    }

    await db.editTodoByID(id, message, completed);

    const msg = {
      id,
      username,
      message,
      completed
    };

    res.send(JSON.stringify(msg)).end();
  } catch (err) {
    res
      .status(500)
      .send(JSON.stringify({ status: "error", error: err.toString() }))
      .end();
  }
});

// DELETE - Allow user to delete one of their todos
// PRIVATE route for specific user
router.delete(
  "/todos/:username/delete/:id",
  isAuthenticated,
  async (req, res) => {
    let { username, id } = req.params;

    if (!username || !id) {
      return res
        .status(400)
        .send(JSON.stringify(ERROR_MISSING_FIELD))
        .end();
    }

    username = username.toLowerCase();
    const decodedId = req.user.id;

    try {
      let user = await db.getUserByName(username);
      if (user.id !== decodedId) {
        // Username decoded token does not match this user
        return res
          .status(400)
          .send(JSON.stringify(ERROR_TOKEN))
          .end();
      }

      const todo = await db.getTodosById(id);
      // Ensure that this todo is accessible by this user
      if (!todo || todo.length === 0 || todo[0].username !== username) {
        return res
          .status(401)
          .send(JSON.stringify(ERROR_TOKEN))
          .end();
      }

      await db.deleteTodosById(id);

      res.send(JSON.stringify(SUCCESS_DELETE)).end();
    } catch (err) {
      res
        .status(500)
        .send(JSON.stringify({ status: "error", error: err.toString() }))
        .end();
    }
  }
);

module.exports = router;
