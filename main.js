var express = require('express');
var session = require('express-session');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var PORT = process.env.PORT || 3000;
var cors = require('cors');
const rimraf = require('rimraf');

var Storage = multer.diskStorage({

  destination: function(req, file, callback) {
      // console.log(1)
      callback(null, path.join(__dirname + "/Images"));

  },

  filename: function(req, file, callback) {

      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);

  }

});

var upload = multer({

  storage: Storage

}).single("img1"); //Field name and max count

const Pool = require('pg').Pool;
var pool;
if(process.env.DATABASE_URL == null){
  pool = new Pool({ //testing
    user: 'aniket',
    host: 'localhost',
    database: 'aniket',
    password: 'aniketab',
    port: 5432,
  });
  
} else {
  pool = new Pool({  //deployed
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });  
}

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req, res){
  if(req.session.loggedin){
    res.redirect('/home');
  } else {
    res.redirect('/auth');
  }
});

app.get('/auth', function(request, response) {
  response.sendFile(path.join(__dirname + '/login.html'));
  // response.end();
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
  var password = request.body.password;
  // console.log("username"+username+" "+password);
	if (username && password) {
		pool.query('SELECT * FROM accounts WHERE userid=$1 AND passwd=$2',[username,password], function(error, results) {
            if(results){
                if (results.rows.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = username;
                    response.sendFile(path.join(__dirname + '/grievance.html'));
                    // console.log(0);
                } else {
                    response.send('Incorrect Username and/or Password!');
                    // console.log(1);
                }
            }
            if(error){
                // console.log(error);
            }
		});
	} else {
		response.send('Please enter Username and Password!');
		// response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
    response.sendFile(path.join(__dirname+"/grievance.html"));
  } else {
		response.send('Please login to view this page!');
	}
	// response.end();
});

app.post('/grievance',upload, function(req, res) {
  var locationx = req.body.locationx;
  var locationy = req.body.locationy;
  var time = req.body.time;
  if(locationx == "0" || locationy == "0"){
    res.send("Geolocation not supported. Use a different browser");
  }
  // if(parseFloat(locationy) <= 72.6466326489 || parseFloat(locationy) >= 73.2453875317){
    // console.log(locationy);
    // res.send("Location unsupported");
  // }
  // else{
    // if(parseFloat(locationx) >= 19.4998677114 || parseFloat(locationx) <= 18.89395652){
      // res.send("Location unsupported");
      // console.log(locationy);
    // }
  // }
  if(req.file){
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['./Image_classifier/predict.py']);
    pyProg.stdout.on('data', function(data) {
      console.log(data.toString());
        if(parseFloat(data.toString())>0.5){
          pool.query('INSERT INTO locations (userid,locationx,locationy,time) VALUES ($1,$2,$3,$4);',[req.session.username,locationx,locationy,time], function(error,results){
            if(error){
              console.log(error);
              res.send('Try later.');
            }
          });
          res.sendFile(path.join(__dirname+"/summary.html"));
        } else {
          res.send("Not a photo of garbage. Resubmit the photo");
        }
    });
    pyProg.stderr.on('data', function(data) {
      console.log(data.toString());
    });
    setTimeout(() => {
      rimraf('./Images/*', function () { console.log('done'); });
    }, 10000);
  } else{
    console.log(1);
  }
});

app.get('/summary',function(req,res){
  res.sendFile(path.join(__dirname+'/summary.html'));
});

app.get('/data',function(req,res){
  if(req.session.loggedin || true){
    if(req.params.user != 'Me'){
      if(req.params.time == 'ALL'){
        pool.query('SELECT * FROM locations;',function(err,results){
          if (err){
            console.log(err);
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );  
            res.send("Some error occurred");
          } else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            res.send(results);
          }
        });
      } else if(req.params.time == 'Morning'){
        pool.query('SELECT * FROM locations WHERE time < "12:00:00";',function(err,results){
          if (err){
            console.log(err);
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );  
            res.send("Some error occurred");
          } else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            res.send(results);
          }
        });
      } else if(req.params.time == "Afternoon"){
        pool.query('SELECT * FROM locations WHERE time < "18:00:00";',function(err,results){
          if (err){
            console.log(err);
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );  
            res.send("Some error occurred");
          } else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            res.send(results);
          }
        });
      } else {
        pool.query('SELECT * FROM locations WHERE time > "18:00:00";',function(err,results){
          if (err){
            console.log(err);
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );  
            res.send("Some error occurred");
          } else {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            res.send(results);
          }
        });
      }
      
    } else {
      pool.query('SELECT * FROM locations WHERE userid=$1;',[req.session.username],function(err,results){
        if(err){
          console.log(err);
          res.send("Some error occurred");
        } else {
          res.send(results);
        }
      });
    }
  }
});

app.listen(PORT);
