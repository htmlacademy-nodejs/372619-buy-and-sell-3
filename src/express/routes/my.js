'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const auth = require(`../middlewares/auth`);

const myRouter = new Router();
myRouter.use(auth);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers();
  res.render(`my-tickets`, {offers, user});
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const {offers} = await api.getOffers({offset: 0, limit: 3, withComments: true});
  res.render(`comments`, {offers, user});
});

module.exports = myRouter;
