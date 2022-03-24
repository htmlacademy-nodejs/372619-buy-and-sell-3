'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const api = require(`../api`).getAPI();
const imageStorage = require(`../image-storage`);
const {ensureArray} = require(`../../utils`);

const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories});
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories(true)
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

const uploadImage = multer({storage: imageStorage});
offersRouter.post(`/add`, uploadImage.single(`avatar`), async (req, res) => {
  const formValues = req.body;
  const {file} = req;

  const offerData = {
    picture: file ? file.filename : ``,
    price: formValues.price,
    type: formValues.action,
    description: formValues.comment,
    title: formValues[`ticket-name`],
    categories: ensureArray(formValues.categories),
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id, {withComments: true});
  res.render(`offers/ticket`, {offer});
});

module.exports = offersRouter;
