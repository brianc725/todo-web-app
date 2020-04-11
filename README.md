# Todo App

A web application to track individual's lists of tasks as todos. 
Users are authenticated with a username and password this is hashed 
with bcrypt and uses tokens for private routes.

Frontend: React

Backend: Node, Express, sqlite3

## Overview

This web application utilized Glitch primarily for hosting purposes (frontend, backend, and db all for free) 
but ended up also being my development environment as well just to try it out. 

I used React for the frontend with reactstrap and utilized hooks and contexts instead
of using state as I previously worked with. The reason for this was primarily just 
to practice and play around with hooks as I have not used them before.

The React frontend uses `fetch` to call my `/api` routes in `api/controller.js` which
ultimately calls my `db.js` which manipulates the sqlite3 database.

## Frontend

Used React and also React Router for the routing of the client views. Reactstrap was used for basic styling.

## Backend

The main files are `api/controller.js`, `db.js`, and `server.js`.

For user authentication, `JSON Web Tokens` and `bcrypt` were utilized. Upon registration, 
an user's password was hashed and salted before being stored in the database. For login, 
`bcrypt.compare` was used to ensure the passwords matched. The server does not store the user's
password in plain text. JSON Web Tokens were used to create and verify user tokens so that username
and password did not have to be passed around for user's private routes. This also ensured that only
the user could manipulate their data of their account. 

With React, the user's token is all that is needed to store in context to be used for all GET, POST,
and DELETE request.

### api/controller.js

Handles all of the routes necessary for the backend. This file also contains all user authentication
mechanisms such as 

### db.js

Handles the table creations and all necessary SQL database operations for the sqlite3 table.

### server.js

Just the basic express setup. Any routes to `/api` will route through backend file `api/controller.js` instead.
All other routes will just serve the static `html` site that React will later manipulate.

## Notes

Commits were made by the Glitch export feature, and thus the user committing is as "Glitch (todo-app-sqlite3)"
instead of my normal account. However, aside from the boilerplate files such as `watch.json` and 
`webpack.config.js`, the rest of the work here in this repo are my own.

Project boilerplate was bootstrapped by Rui Ramos, based on the React App and 
sqlite3 starters by [Glitch](https://glitch.com)!

Glitch is the friendly commmunity where you'll build the app of your dreams. Glitch lets you
instantly create, remix, edit, and host an app, bot or site, and you can invite collaborators
or helpers to simultaneously edit code with you.

[Find out more](https://glitch.com/about).

\ ゜ o ゜)ノ
