const mysqlQuery = require('../utils/mysqlQuery');

exports.addComment = async ({ contents, projectId, userId, parent = null, seq = 1 } = {}) =>
  await mysqlQuery(
    'INSERT INTO comment(contents, created, project_project_id, user_user_id, parent, seq) value((?), now(), (?), (?), (?), (?))',
    [contents, projectId, userId, parent, seq]
  );

exports.getComment = async commentId => {
  const [commentData] = await mysqlQuery('SELECT * FROM comment WHERE comment_id=(?)', [commentId]);
  const [authorData] = await mysqlQuery('SELECT nickname, profile_photo FROM user WHERE user_id=(?)', [
    commentData.user_user_id,
  ]);

  return { ...commentData, ...authorData };
};

exports.fetchComment = async projectId => {
  const comments = await mysqlQuery(
    'SELECT * FROM comment WHERE project_project_id=(?) ORDER BY IF(ISNULL(parent), comment_id, parent), seq',
    [projectId]
  );

  return await Promise.all(
    comments.map(async comment => {
      const [authorInfo] = await mysqlQuery('SELECT nickname, profile_photo FROM user WHERE user_id=(?)', [
        comment.user_user_id,
      ]);

      return {
        ...comment,
        ...authorInfo,
      };
    })
  );
};

exports.deleteComment = async commentId =>
  await mysqlQuery('UPDATE comment SET is_deleted = 1 WHERE comment_id=(?) LIMIT 1', [commentId]);

exports.editComment = async ({ contents, commentId, projectId, userId }) =>
  await mysqlQuery(
    'UPDATE comment SET contents = (?) WHERE comment_id=(?) and project_project_id=(?) and user_user_id=(?) LIMIT 1',
    [contents, commentId, projectId, userId]
  );

exports.getProjectCommentCount = async projectId =>
  await mysqlQuery('SELECT COUNT(comment_id) as commentCount FROM comment WHERE project_project_id=(?)', [
    projectId,
  ]);

exports.getCommentAuthorUniqueId = async commentId =>
  await mysqlQuery('SELECT user_user_id as commentAuthorId FROM comment WHERE comment_id=(?)', [commentId]);
