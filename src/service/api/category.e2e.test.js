'use strict';

const express = require(`express`);
const request = require(`supertest`);

const categoryApi = require(`./category`);
const CategoryService = require(`../data-service/category`);
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

const app = express();
app.use(express.json());
categoryApi(app, new CategoryService(mockData));

describe(`API returns category list`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app).get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`Correct category names`, () => expect(response.body).toEqual(expect.arrayContaining([`Книги`, `Животные`, `Журналы`, `Посуда`])));
});
