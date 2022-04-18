'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (offerService) => async (req, res, next) => {
  const {offerId} = req.params;
  const offer = await offerService.find(offerId);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${offerId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
