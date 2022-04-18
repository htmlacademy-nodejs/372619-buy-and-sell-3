'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {Sequelize} = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const categoryApi = require(`./category`);
const CategoryService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Животные`,
  `Журналы`,
  `Игры`
];

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    name: `Иван Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    name: `Пётр Петров`,
    avatar: `avatar2.jpg`
  }
];

const mockOffers = [
  {
    "title": `Куплю детские санки.`,
    "picture": `item14.jpg`,
    "description": `Кому нужен этот новый телефон, если тут такое... Это настоящая находка для коллекционера! Продаю с болью в сердце... Если найдёте дешевле — сброшу цену.`,
    "type": `OFFER`,
    "price": 96004,
    "categories": [
      `Игры`,
      `Журналы`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво? А сколько игр в комплекте?`
      }
    ],
    "user": `ivanov@example.com`,
  },
  {
    "title": `Куплю породистого кота.`,
    "picture": `item16.jpg`,
    "description": `Мой дед не мог её сломать. Кажется, что это хрупкая вещь. Две страницы заляпаны свежим кофе. Товар в отличном состоянии.`,
    "type": `OFFER`,
    "price": 50937,
    "categories": [
      `Игры`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "user": `petrov@example.com`,
        "text": `А сколько игр в комплекте? Оплата наличными или перевод на карту? Почему в таком ужасном состоянии?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии? Вы что?! В магазине дешевле.`
      }
    ],
    "user": `petrov@example.com`,
  },
  {
    "title": `Куплю детские санки.`,
    "picture": `item12.jpg`,
    "description": `Не пытайтесь торговаться. Цену вещам я знаю. Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену. Даю недельную гарантию.`,
    "type": `OFFER`,
    "price": 5005,
    "categories": [
      `Журналы`,
      `Животные`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?`
      }
    ],
    "user": `ivanov@example.com`,
  },
  {
    "title": `Продам советскую посуду. Почти не разбита.`,
    "picture": `item08.jpg`,
    "description": `Даю недельную гарантию. Таких предложений больше нет! Это настоящая находка для коллекционера! Две страницы заляпаны свежим кофе.`,
    "type": `OFFER`,
    "price": 24537,
    "categories": [
      `Игры`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво?`
      }
    ],
    "user": `petrov@example.com`,
  },
  {
    "title": `Продам коллекцию журналов «Огонёк».`,
    "picture": `item02.jpg`,
    "description": `Если найдёте дешевле — сброшу цену. Продаю с болью в сердце... Бонусом отдам все аксессуары. Даю недельную гарантию.`,
    "type": `OFFER`,
    "price": 81996,
    "categories": [
      `Животные`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Совсем немного...`
      }
    ],
    "user": `ivanov@example.com`,
  }
];

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDb, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  categoryApi(app, new CategoryService(mockDb));
});

describe(`API returns category list`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app).get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));
  test(`Correct category names`, () => expect(response.body.map((it) => it.name)).toEqual(expect.arrayContaining([`Журналы`, `Игры`, `Животные`])));
});
