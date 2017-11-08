class CommentDAO {
  constructor(model, connect) {
    this._Comment = model;
    this._connect = connect;
  }

  create(args, callback){
    this._connect();

    this._Comment.create(args, callback)
  }

  list(args, callback){
    this._connect();

    this._Comment.find({"user.id": {$eq: args}}, callback);
  }

  update(args, callback){
    this._connect();

    this._Comment.updateOne(
      {"user.id": {$eq: args.userId}, _id: args.commentId},
      {$set: {comment: args.comment}},
      callback);
  }

  delete(args, callback){
    this._connect();

    this._Comment.deleteOne(
      {"user.id": {$eq: args.userId}, _id: args.commentId},
      callback)
      .then(result => console.log("comment deleted"))
      .catch(err => console.log(err));
  }
}

module.exports = function() {
    return CommentDAO
}
