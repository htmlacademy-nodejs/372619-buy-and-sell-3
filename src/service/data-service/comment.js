'use strict';

const {generateId} = require(`../../utils`);

class CommentService {
  create(offer, comment) {
    const newComment = Object.assign({
      id: generateId()
    }, comment);

    offer.comments.push(newComment);
    return newComment;
  }

  delete(offer, commentId) {
    const removedComment = offer.comments.find((item) => item.id === commentId);
    if (!removedComment) {
      return null;
    }

    offer.comments = offer.comments.filter((item) => item.id !== commentId);

    return removedComment;
  }

  findAll(offer) {
    return offer.comments;
  }
}

module.exports = CommentService;
