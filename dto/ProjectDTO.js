class ProjectDTO {
  constructor({
    project_id,
    subject,
    thumnail,
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
    user_user_id,
  } = {}) {
    this.project_id = project_id;
    this.subject = subject;
    this.thumnail = thumnail;
    this.team_name = team_name;
    this.plan_intention = plan_intention;
    this.start_date = start_date;
    this.end_date = end_date;
    this.github_url = github_url;
    this.deploy_url = deploy_url;
    this.is_private = is_private;
    this.main_contents = main_contents;
    this.created = created;
    this.author = author;
    this.user_user_id = user_user_id;
  }
}
module.exports = ProjectDTO;
