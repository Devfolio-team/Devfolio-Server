class ProjectTeamMemberDTO {
  constructor({ project_team_members_id, member_name, member_github_url, project_project_id }) {
    this.project_team_members_id = project_team_members_id;
    this.member_name = member_name;
    this.member_github_url = member_github_url;
    this.project_project_id = project_project_id;
  }
}

module.exports = ProjectTeamMemberDTO;
