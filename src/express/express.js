'use strict';

const express = require(`express`);
const path = require(`path`);
const myRoutes = require(`./routes/my`);
const offersRoutes = require(`./routes/offers`);
const mainRoutes = require(`./routes/main`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);
app.use(`/`, mainRoutes);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, req, res) => res.status(500).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);

