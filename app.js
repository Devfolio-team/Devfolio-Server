const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const api = require('./api');
const auth = require('./api/auth');

app.use('/api', api);
app.use('/auth', auth);

app.set('port', process.env.PORT || 3020);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
