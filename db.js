const fs = require("fs");

// init sqlite db - copied from hello-sqlite glitch
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  // creates database if file does not exist
  if (!exists) {
    db.serialize(() => {
      db.run(
        "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
      );
      console.log("New table users created!");
      db.run(
        "CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, username TEXT, completed INTEGER)"
      );
      console.log("New table todos created!");
    });
  }
});

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, username from users", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addUser(username, password) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO users(username, password) VALUES (?, ?)", [username, password], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  })
}

function getUserByName(username) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = (?)",
      username,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function getTodosForName(username) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM todos WHERE username = (?)",
      username,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function addTodosForName(message, username, completed) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO todos(message, username, completed) VALUES (?, ?, ?)", [message, username, completed], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  })
}

function getTodosById(id) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM todos WHERE id = (?)",
      id,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

// function editTodoByID(id, message)

function deleteTodosById(id) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM todos WHERE id = (?)",
      id,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}


module.exports = {
  getAllUsers,
  getUserByName,
  addUser,
  getTodosForName,
  addTodosForName,
  getTodosById,
  deleteTodosById
};
