const express = require('express');
const cors = require('cors');

const app = express();
const api = require('./api');

app.use(cors());
app.use(express.json());
app.use('/api', api);

app.set('port', process.env.PORT || 3020);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
