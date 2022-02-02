'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      res.status(HttpCode.BAD_REQUEST).send([]);
      return;
    }

    const searchResults = searchService.findAll(query);
    const searchStatus = searchResults.length ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus).json(searchResults);
  });
};
