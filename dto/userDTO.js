class UserDTO {
  constructor({
    user_id,
    email,
    password,
    name,
    nickname,
    profile_photo,
    created,
    github_url,
    blog_url,
    simple_introduction,
  } = {}) {
    this.user_id = user_id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.nickname = nickname;
    this.profile_photo = profile_photo;
    this.created = created;
    this.github_url = github_url;
    this.blog_url = blog_url;
    this.simple_introduction = simple_introduction;
  }
}

module.exports = UserDTO;
