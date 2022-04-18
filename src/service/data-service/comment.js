'use strict';

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(offerId, comment) {
    return await this._Comment.create({
      offerId,
      ...comment
    });
  }

  async delete(commentId) {
    const deletedRows = await this._Comment.destroy({
      where: {
        id: commentId
      }
    });
    return !!deletedRows;
  }

  async findAll(offerId) {
    return await this._Comment.findAll({
      where: {
        offerId
      },
      raw: true
    });
  }
}

module.exports = CommentService;
