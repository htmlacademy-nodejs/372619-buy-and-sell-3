'use strict';

const {Router} = require(`express`);
const categoryApi = require(`../api/category`);
const offerApi = require(`../api/offer`);
const searchApi = require(`../api/search`);
const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService
} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categoryApi(app, new CategoryService(mockData));
  searchApi(app, new SearchService(mockData));
  offerApi(app, new OfferService(mockData), new CommentService());
})();

module.exports = app;
