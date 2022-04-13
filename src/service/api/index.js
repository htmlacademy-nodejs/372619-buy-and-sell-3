'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const categoryApi = require(`../api/category`);
const offerApi = require(`../api/offer`);
const searchApi = require(`../api/search`);
const userApi = require(`../api/user`);
const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
  UserService,
} = require(`../data-service`);

const app = new Router();
defineModels(sequelize);

(async () => {
  categoryApi(app, new CategoryService(sequelize));
  searchApi(app, new SearchService(sequelize));
  offerApi(app, new OfferService(sequelize), new CommentService(sequelize));
  userApi(app, new UserService(sequelize));
})();

module.exports = app;
