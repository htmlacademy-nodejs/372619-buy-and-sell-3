'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, offers, users}) => {
  const {Category, Offer, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((result, category) => ({
    [category.name]: category.id,
    ...result
  }), {});

  const userModels = await User.bulkCreate(users, {include: [Aliase.OFFERS, Aliase.COMMENTS]});
  const userIdByEmail = userModels.reduce((result, user) => ({
    [user.email]: user.id,
    ...result
  }), {});

  offers.forEach((offer) => {
    offer.userId = userIdByEmail[offer.user];
    offer.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
    await offerModel.addCategories(
        offer.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });

  await Promise.all(offerPromises);
};
