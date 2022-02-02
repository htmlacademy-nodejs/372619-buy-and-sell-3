'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (offerService) => (req, res, next) => {
  const {offerId} = req.params;
  const offer = offerService.find(offerId);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${offerId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
