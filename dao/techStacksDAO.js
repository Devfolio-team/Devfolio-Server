const mysqlQuery = require('../utils/mysqlQuery');

exports.fetchTechStacks = async () => await mysqlQuery('SELECT * FROM tech_stacks');

exports.requestTechStacks = async stackName =>
  await mysqlQuery('INSERT INTO request_tech_stacks(stack_name) value((?))', [stackName]);

exports.getRequestTechStacks = async () =>
  await mysqlQuery('SELECT * FROM request_tech_stacks ORDER BY stack_name', []);
