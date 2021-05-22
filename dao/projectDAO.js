const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');
const mysqlQuery = require('../utils/mysqlQuery');

const pool = mysql.createPool(dbconfig);

// 작성한 순서 내림차순 (최신순 정렬)
exports.fetchProjects = async ({ page, size }) =>
  await mysqlQuery(
    `SELECT project_id, subject, thumbnail, team_name, plan_intention, start_date, end_date, github_url, deploy_url, is_private, main_contents, created, project.user_user_id AS user_user_id, COUNT(project_likes.project_project_id) AS likeCount FROM project LEFT JOIN project_likes ON project.project_id = project_likes.project_project_id GROUP BY project_id ORDER BY project_id desc, project_id desc LIMIT ${
      page * size
    }, ${size}`,
    []
  );

// 좋아요가 많은 순(인기순 정렬)
exports.fetchPopularProjects = async ({ page, size }) =>
  await mysqlQuery(
    `SELECT project_id, subject, thumbnail, team_name, plan_intention, start_date, end_date, github_url, deploy_url, is_private, main_contents, created, project.user_user_id AS user_user_id, COUNT(project_likes.project_project_id) AS likeCount FROM project LEFT JOIN project_likes ON project.project_id = project_likes.project_project_id GROUP BY project_id ORDER BY likeCount desc, project_id desc LIMIT ${
      page * size
    }, ${size}`,
    []
  );

exports.getProject = async project_id => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM project WHERE project_id = (?)', [project_id]);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getAuthorInfo = async userId => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT nickname, profile_photo FROM user WHERE user_id = (?)', [
        userId,
      ]);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getProjectTechStacks = async projectId => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query(
        'SELECT * FROM project_tech_stacks WHERE project_project_id = (?)',
        [projectId]
      );
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getProjectLikeCount = async projectId => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query(
        'SELECT count(project_likes_id) as likeCount FROM project_likes WHERE project_project_id = (?)',
        [projectId]
      );
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.createProject = async ({
  subject,
  thumbnail: { src },
  teamName,
  planIntention,
  startDate,
  endDate,
  githubUrl,
  deployUrl,
  isPrivate,
  mainContents,
  userUserId,
  techStacks,
  // teamMembers,
}) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query(
        `INSERT INTO project(
          subject,
          thumbnail,
          team_name,
          plan_intention,
          start_date,
          end_date,
          github_url,
          deploy_url,
          is_private,
          main_contents,
          created,
          user_user_id
          ) values((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), now(), (?))`,
        [
          subject,
          src,
          teamName,
          planIntention,
          startDate,
          endDate,
          githubUrl,
          deployUrl,
          isPrivate,
          mainContents,
          userUserId,
        ]
      );

      const { affectedRows, insertId, serverStatus } = rows;

      if (affectedRows && serverStatus === 2) {
        if (techStacks[0]) {
          try {
            const techStacksQuery = techStacks
              .map(techStack => `,('${techStack}',${insertId})`)
              .join('')
              .slice(1);

            await connection.query(
              `INSERT INTO project_tech_stacks(tech_name, project_project_id) values ${techStacksQuery}`
            );
          } catch (error) {
            connection.release();
            return 'project_tech_stacks Query Error';
          }
        }
        // try {
        //   const teamMembersQuery = teamMembers
        //     // team_members는 배열로 넘어와야하고 member는 배열내에 존재하는 객체이다. 프로퍼티는 아래와 같이 2가지를 가지고 있어야한다.
        //     .map(member => `,('${member.memberName}', '${member.memberGithubUrl}',${insertId})`)
        //     .join('')
        //     .slice(1);
        //   await connection.query(
        //     `INSERT INTO project_team_members(member_name, member_github_url, project_project_id) values ${teamMembersQuery}`
        //   );
        // } catch (error) {
        //   connection.release();
        //   return 'team_members Query Error';
        // }
      }
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Project Insert Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.modifyProject = async ({
  subject,
  thumbnail: { src },
  teamName,
  planIntention,
  startDate,
  endDate,
  githubUrl,
  deployUrl,
  isPrivate,
  mainContents,
  techStacks,
  projectId,
}) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query(
        `UPDATE project SET
          subject=(?),
          ${src ? `thumbnail='${src}',` : ''}
          team_name=(?),
          plan_intention=(?),
          start_date=(?),
          end_date=(?),
          github_url=(?),
          deploy_url=(?),
          is_private=(?),
          main_contents=(?)
          WHERE project_id=(?) LIMIT 1`,
        [
          subject,
          teamName,
          planIntention,
          startDate,
          endDate,
          githubUrl,
          deployUrl,
          isPrivate,
          mainContents,
          projectId,
        ]
      );

      const { affectedRows, serverStatus } = rows;

      if (affectedRows && serverStatus === 2) {
        if (techStacks[0]) {
          try {
            await connection.query('DELETE FROM project_tech_stacks WHERE project_project_id=(?) LIMIT 200', [
              projectId,
            ]);

            const techStacksQuery = techStacks
              .map(techStack => `,('${techStack}',${projectId})`)
              .join('')
              .slice(1);

            await connection.query(
              `INSERT INTO project_tech_stacks(tech_name, project_project_id) values ${techStacksQuery}`
            );
          } catch (error) {
            connection.release();
            return 'project_tech_stacks Query Error';
          }
        }
      }
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Project Insert Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.deleteProject = async projectId => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('DELETE FROM project WHERE project_id = (?) LIMIT 1', [
        projectId,
      ]);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getFavoriteProject = async (userId, { page, limit }) =>
  await mysqlQuery(
    `SELECT * FROM project JOIN project_likes WHERE project_id = project_project_id and project_likes.user_user_id=(?) ORDER BY project_likes_id desc LIMIT ${
      page * limit
    }, ${limit}`,
    [userId]
  );
