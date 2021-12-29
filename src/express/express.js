'use strict';

const express = require(`express`);

const offersRoutes = require(`./routes/offers`);
const myRoutes = require(`./routes/my`);
const mainRoutes = require(`./routes/main`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DEFAULT_PORT);

