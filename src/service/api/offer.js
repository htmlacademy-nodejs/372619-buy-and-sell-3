'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, withComments} = req.query;
    let result;
    if (offset || limit) {
      result = await offerService.findPage({offset, limit, withComments});
    } else {
      result = await offerService.findAll(withComments);
    }
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {withComments} = req.query;
    const {offerId} = req.params;
    const offer = await offerService.find(offerId, withComments);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const isUpdated = await offerService.create(req.body);
    return res.status(HttpCode.CREATED).json(isUpdated);
  });

  route.put(`/:offerId`, [routeParamsValidator, offerValidator], async (req, res) => {
    const {offerId} = req.params;
    const isUpdated = await offerService.update(offerId, req.body);

    if (!isUpdated) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }


    return res.status(HttpCode.OK).send(`Updated`);
  });

  route.delete(`/:offerId`, routeParamsValidator, async (req, res) => {
    const {offerId} = req.params;
    const isDeleted = await offerService.delete(offerId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(`Deleted`);
  });

  route.get(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService)], async (req, res) => {
    const {offer} = res.locals;
    const comments = await commentService.findAll(offer.id);

    res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:offerId/comments/:commentId`, [routeParamsValidator, offerExist(offerService)], async (req, res) => {
    const {commentId} = req.params;
    const isDeleted = await commentService.delete(commentId);

    if (!isDeleted) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(`Deleted`);
  });

  route.post(`/:offerId/comments`, [routeParamsValidator, offerExist(offerService), commentValidator], async (req, res) => {
    const {offer} = res.locals;
    const comment = await commentService.create(offer.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
