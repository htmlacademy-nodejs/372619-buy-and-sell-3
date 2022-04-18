'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
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

  async find(id, withComments) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (withComments) {
      include.push(
          {
            model: this._Comment,
            as: Aliase.COMMENTS,
            include: [
              {
                model: this._User,
                as: Aliase.USERS,
                attributes: {
                  exclude: [`passwordHash`]
                }
              }
            ]
          }
      );
    }

    return await this._Offer.findByPk(id, {include});
  }

  async findAll(withComments) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const offers = await this._Offer.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return offers.map((item) => item.get());
  }

  async findPage({limit, offset, withComments}) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      },
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      }
      );
    }

    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, offers: rows};
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = OfferService;
