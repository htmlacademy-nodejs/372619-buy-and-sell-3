'use strict';

const {generateId} = require(`../../utils`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = Object.assign({id: generateId(), comments: []}, offer);
    this._offers.push(newOffer);
    return newOffer;
  }

  delete(id) {
    const offer = this.find(id);
    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  findAll() {
    return this._offers;
  }

  find(id) {
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this.find(id);
    return Object.assign(oldOffer, offer);
  }
}

module.exports = OfferService;
