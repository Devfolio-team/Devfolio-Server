const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');

const ProjectDTO = require('../dto/ProjectDTO');

const pool = mysql.createPool(dbconfig);

exports.fetchProjects = async () => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM project');
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

exports.createProject = async ({
  subject,
  thumbnail,
  teamName,
  planIntention,
  startDate,
  endDate,
  githubUrl,
  deployUrl,
  isPrivate,
  mainContents,
  author,
  userUserId,
  techStacks,
  teamMembers,
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
          author,
          user_user_id
          ) values((?), (?), (?), (?), (?), (?), (?), (?), (?), (?), now(), (?), (?))`,
        [
          subject,
          thumbnail,
          teamName,
          planIntention,
          startDate,
          endDate,
          githubUrl,
          deployUrl,
          isPrivate,
          mainContents,
          author,
          userUserId,
        ]
      );

      const { affectedRows, insertId, serverStatus } = rows;

      if (affectedRows && serverStatus === 2) {
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
          return 'Query Error';
        }
        try {
          const teamMembersQuery = teamMembers
            // team_members는 배열로 넘어와야하고 member는 배열내에 존재하는 객체이다. 프로퍼티는 아래와 같이 2가지를 가지고 있어야한다.
            .map(member => `,('${member.memberName}', '${member.memberGithubUrl}',${insertId})`)
            .join('')
            .slice(1);
          await connection.query(
            `INSERT INTO project_team_members(member_name, member_github_url, project_project_id) values ${teamMembersQuery}`
          );
        } catch (error) {
          connection.release();
          return 'Query Error';
        }
      }
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
