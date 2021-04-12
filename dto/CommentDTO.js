class CommentDTO {
  constructor({ comment_id, contents, created, author, project_project_id, user_user_id }) {
    this.comment_id = comment_id;
    this.contents = contents;
    this.created = created;
    this.author = author;
    this.project_project_id = project_project_id;
    this.user_user_id = user_user_id;
  }
}

module.exports = CommentDTO;
