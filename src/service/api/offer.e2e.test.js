'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offerApi = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `lGyCYn`,
    "title": `Куплю детские санки.`,
    "picture": `item14.jpg`,
    "description": `Кому нужен этот новый телефон, если тут такое... Это настоящая находка для коллекционера! Продаю с болью в сердце... Если найдёте дешевле — сброшу цену.`,
    "type": `offer`,
    "sum": 96004,
    "category": [
      `Книги`
    ],
    "comments": [
      {
        "id": `2v2oe-`,
        "text": `С чем связана продажа? Почему так дешёво? А сколько игр в комплекте?`
      }
    ]
  },
  {
    "id": `x7MIla`,
    "title": `Куплю породистого кота.`,
    "picture": `item16.jpg`,
    "description": `Мой дед не мог её сломать. Кажется, что это хрупкая вещь. Две страницы заляпаны свежим кофе. Товар в отличном состоянии.`,
    "type": `offer`,
    "sum": 50937,
    "category": [
      `Животные`
    ],
    "comments": [
      {
        "id": `26louI`,
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "id": `UVpkgT`,
        "text": `А сколько игр в комплекте? Оплата наличными или перевод на карту? Почему в таком ужасном состоянии?`
      },
      {
        "id": `wejCeb`,
        "text": `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии? Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    "id": `ui2YLu`,
    "title": `Куплю детские санки.`,
    "picture": `item12.jpg`,
    "description": `Не пытайтесь торговаться. Цену вещам я знаю. Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену. Даю недельную гарантию.`,
    "type": `offer`,
    "sum": 5005,
    "category": [
      `Книги`
    ],
    "comments": [
      {
        "id": `klxamU`,
        "text": `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "id": `JJmRfM`,
    "title": `Продам советскую посуду. Почти не разбита.`,
    "picture": `item08.jpg`,
    "description": `Даю недельную гарантию. Таких предложений больше нет! Это настоящая находка для коллекционера! Две страницы заляпаны свежим кофе.`,
    "type": `offer`,
    "sum": 24537,
    "category": [
      `Журналы`
    ],
    "comments": [
      {
        "id": `kLFCnr`,
        "text": `С чем связана продажа? Почему так дешёво?`
      }
    ]
  },
  {
    "id": `HFOCrD`,
    "title": `Продам коллекцию журналов «Огонёк».`,
    "picture": `item02.jpg`,
    "description": `Если найдёте дешевле — сброшу цену. Продаю с болью в сердце... Бонусом отдам все аксессуары. Даю недельную гарантию.`,
    "type": `offer`,
    "sum": 81996,
    "category": [
      `Посуда`
    ],
    "comments": [
      {
        "id": `cUycsp`,
        "text": `Совсем немного...`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneMockData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offerApi(app, new OfferService(cloneMockData), new CommentService());

  return app;
};


describe(`API returns a list of all offers`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "lGyCYn"`, () => expect(response.body[0].id).toBe(`lGyCYn`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).get(`/offers/lGyCYn`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Куплю детские санки."`, () => expect(response.body.title).toBe(`Куплю детские санки.`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app).post(`/offers`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).put(`/offers/lGyCYn`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, () => request(app).get(`/offers/lGyCYn`).expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const app = createAPI();

  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  return request(app).put(`/offers/NOEXST`).send(validOffer).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app).put(`/offers/lGyCYn`).send(invalidOffer).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).delete(`/offers/lGyCYn`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`lGyCYn`));
  test(`Offer count is 4 now`, () => request(app).get(`/offers`).expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();
  return request(app).delete(`/offers/NOEXST`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();
  return request(app).post(`/offers/NOEXST/comments`).send({text: `Неважно`}).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();
  return request(app).delete(`/offers/lGyCYn/comments/NOEXST`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).get(`/offers/x7MIla/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id is "26louI"`, () => expect(response.body[0].id).toBe(`26louI`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app)
      .post(`/offers/lGyCYn/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app).get(`/offers/lGyCYn/comments`).expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();
  return request(app).post(`/offers/NOEXST/comments`).send({text: `Неважно`}).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();
  return request(app).post(`/offers/lGyCYn/comments`).send({}).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).delete(`/offers/lGyCYn/comments/2v2oe-`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`2v2oe-`));
  test(`Comments count is 0 now`, () => request(app).get(`/offers/lGyCYn/comments`).expect((res) => expect(res.body.length).toBe(0)));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();
  return request(app).delete(`/offers/lGyCYn/comments/NOEXST`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {
  const app = createAPI();
  return request(app).delete(`/offers/NOEXST/comments/2v2oe-`).expect(HttpCode.NOT_FOUND);
});
