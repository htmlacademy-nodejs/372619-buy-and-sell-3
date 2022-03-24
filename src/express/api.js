'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({offset, limit, withComments} = {}) {
    return this._load(`/offers`, {params: {offset, limit, withComments}});
  }

  getOffer(id, {withComments} = {}) {
    return this._load(`/offers/${id}`, {params: {withComments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(withCount) {
    return this._load(`/category`, {params: {withCount}});
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
