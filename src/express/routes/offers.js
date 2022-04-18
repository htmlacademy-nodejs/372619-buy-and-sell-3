'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const csrfProtection = csrf();

const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;
  res.render(`offers/category`, {user});
});

offersRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories, user, csrfToken: req.csrfToken()});
});

offersRouter.post(`/add`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const formValues = req.body;
  const {file} = req;

  const offerData = {
    picture: file ? file.filename : ``,
    price: formValues.price,
    type: formValues.action,
    description: formValues.comment,
    title: formValues[`ticket-name`],
    categories: ensureArray(formValues.categories),
    userId: user.id
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`offers/new-ticket`, {categories, user, validationMessages});
  }
});

const getEditOfferData = async (offerId) => {
  const [offer, categories] = await Promise.all([
    api.getOffer(offerId),
    api.getCategories()
  ]);
  return [offer, categories];
};

offersRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [offer, categories] = await getEditOfferData(id);
  res.render(`offers/ticket-edit`, {id, offer, categories, user, csrfToken: req.csrfToken()});
});

offersRouter.post(`/edit/:id`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const formValues = req.body;
  const {file} = req;
  const {id} = req.params;

  const offerData = {
    picture: file ? file.filename : formValues[`old-image`],
    price: formValues.price,
    type: formValues.action,
    description: formValues.comment,
    title: formValues[`ticket-name`],
    categories: ensureArray(formValues.categories),
    userId: user.id
  };

  try {
    await api.editOffer(id, offerData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [offer, categories] = await getEditOfferData(id);
    res.render(`offers/ticket-edit`, {id, offer, categories, user, validationMessages});
  }
});

offersRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const offer = await api.getOffer(id, {withComments: true});
  res.render(`offers/ticket`, {id, offer, user, csrfToken: req.csrfToken()});
});

offersRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/offers/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const offer = await api.getOffer(id, {withComments: true});
    res.render(`offers/ticket`, {id, offer, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = offersRouter;
