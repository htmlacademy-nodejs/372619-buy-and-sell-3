'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async create(offer) {
    const newOffer = await this._Offer.create(offer);
    await newOffer.addCategories(offer.categories);
    return newOffer;
  }

  async delete(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }

    const offers = await this._Offer.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return offers.map((item) => item.get());
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, offers: rows};
  }

  async find(id, withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }

    return await this._Offer.findByPk(id, {include});
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = OfferService;
