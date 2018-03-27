const express = require('express');
const app     = express();

var helmet = require('helmet')
app.use(helmet())

var fs = require('fs');
var options = {
    key  : fs.readFileSync('/etc/ssl/private/thanks.parentround.com.pem'),
    cert : fs.readFileSync('/etc/ssl/certs/thanks.parentround.com.pem'),
    ca : fs.readFileSync('/etc/ssl/ca-bundle/thanks.parentround.com.pem')
};
server 	  = require('https').createServer(options, app);

const bodyParser= require('body-parser');
const config  = require('./config.js');
const routes  = require('./routes/index.js');
const fileUpload = require('express-fileupload');
const path    = require('path');
const hogan   = require('hogan-express');
var cors = require('cors')

app.use(cors())

app.engine('html', hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('partials', { /* header: 'partials/header' */ });

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes(app);
app.use('/assets',express.static(path.join(__dirname, 'assets')));
app.use('/images',express.static(path.join(__dirname, 'uploads')));
app.get('*', function(req, res){
  res.status(404).json({status:'failed',message:'endpoint not found!'});
});

app.set('host', process.env.HOST || 'localhost');
server.listen(config.port, ()=> {
  console.log('Server spinning on :' + config.port);
  console.log('Mode               :' + (process.env.NODE_ENV=='production'?'PRODUCTION':'DEVELOPMENT'));
});
