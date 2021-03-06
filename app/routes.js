var Scenario     = require('./models/scenario');
var fs = require('fs');
var chokidar = require('chokidar');

var watcher = chokidar.watch ('files', {persistent: true});
var tmpFileCheck = false;
watcher
  .on ('add', function(path){console.log(path, 'added'); 
    //tmpFileCheck = true;
    })
  .on ('change', function(path){console.log(path, 'changed'); 
    tmpFileCheck = true;
    })
  .on ('unlink', function(path){console.log(path, 'removed');});

watcher.on('change', function(path,stats){
     if (stats) console.log('File', path, 'changed size to', stats.size);
});
watcher.add('input_temp.json');









module.exports = function(app, passport,express) {

    //  home page 
    app.get('/api/PlanInitOutput',function(req,res){
        //use commend line via R to compute the data and generate the file.
        var cmd = 'R CMD BATCH --no-save --no-restore "--args input_temp.json" C:/Users/Administrator/Desktop/ccc/ROIServer/R/algorithms/RM.R';
            var exec = require('child_process').exec;
            var last = exec(cmd);
            last.stdout.on('data', function (data) {
            console.log('standard output：' + data);
            });
            last.on('exit', function (code) {
            console.log('child_process exit. code：' + code);
            }); 
            
            setTimeout(
                    function() {
                            var data= fs.readFileSync('R/output/input_temp.json', 'utf-8');
                            var jsonData = JSON.parse(data);
                            res.send(jsonData);
                                },500); 
        
    });

    app.get('/api/PlanRunOutput',function(req,res){
        //use commend line via R to compute the data and generate the file.
        var cmd = 'R CMD BATCH --no-save --no-restore "--args input_temp_run.json" C:/Users/Administrator/Desktop/ccc/ROIServer/R/algorithms/RM.R';
            var exec = require('child_process').exec;
            var last = exec(cmd);
            last.stdout.on('data', function (data) {
            console.log('standard output：' + data);
            });
            last.on('exit', function (code) {
            console.log('child_process exit. code：' + code);
            }); 
            res.send("run step processing ");
            /*
            setTimeout(
                    function() {
                            var data= fs.readFileSync('R/output/input_temp_run.json', 'utf-8');
                            var jsonData = JSON.parse(data);
                            res.send(jsonData);
                                },1500); 
            */
        
    });

    app.get('/api/testGet', function(req, res) {
        var data;
        data = {'test':false};
        if(tmpFileCheck){
            data.test = true;
        }
        console.log(data.test);
        res.json(data); 
    });
    app.get('/api/test',function(req,res){
        var data;

        //replace this line and change the url to 
        data = fs.readFileSync('dummy_data/output/1431639870_70.json', 'utf-8');


        var jsonData = JSON.parse(data);
        res.send(jsonData);
    });


    app.get('/api/getJsonDelay',function(req,res){
        var data;
        data = fs.readFileSync('dummy_data/output/1431639870_70.json', 'utf-8');
        var jsonData = JSON.parse(data);
        setTimeout(function(){
            res.send(jsonData);
        },1000*60);
        
    });


    app.post('/api/test', function(req, res) {
        var data = fs.readFileSync('dummy_data/output/1431639870_70.json', 'utf-8');
        var jsonData = JSON.parse(data);
        //add some R commend line and get teh data by the child process.
        // ************** add R commend line here ***********************
        var cmd = 'R CMD BATCH --no-save --no-restore "--args input_temp.json" C:/Users/Administrator/Desktop/ccc/ROIServer/R/algorithms/RM.R';
        //console.log(cmd);
        var exec = require('child_process').exec;
        last = exec(cmd);
        last.stdout.on('data', function (data) {
        console.log('standard output：' + data);
        });
        last.on('exit', function (code) {
        console.log('child_process exit. code：' + code);
        });
        //delay 2s to get the changed file with data consider the process time
        setTimeout(
                    function() {
                        res.send(jsonData);
                                },2000); 
    });

    // LOGOUT 
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


        // LOGIN 
        // show the login.ejs form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });
 
        // process the login.html form
        app.post('/api/login', passport.authenticate('local-login', {
            successRedirect : '/home.html', 
            failureRedirect : '/', 
            failureFlash : true 
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });

        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', 
            failureRedirect : '/signup', 
            failureFlash : true 
        }));


    // local  unlink for test -----------------------------------
    /*
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    */

    app.get('/scenarios',function(req,res){
        Scenario.find(function(err, scenarios) {
            if (err)
                res.send(err);

            res.json(scenarios);
        });
    });

    app.post('/scenarios',function(req,res){
        var data = fs.readFileSync('dummy_data/output/1431639870_70.json', 'utf-8');
        console.log(data);

        var scenario = new Scenario(JSON.parse(data));

        scenario.save(function(err) {
            if (err)
                res.send(err);
            res.json(scenario);
        });
    });

    app.get('/scenarios/:scenario_id',function(req,res){
        Scenario.findById(req.params.scenario_id, function(err, scenario) {
            if (err)
                res.send(err);
            res.json(scenario);
        });
    });

    app.put('/scenarios/:scenario_id',function(req,res){
        Scenario.findById(req.params.scenario_id, function(err, scenario) {

            if (err)
                res.send(err);

            scenario.UserName = req.body.userName;
            scenario.Brand = req.body.brand;
            scenario.Spend = req.body.spend;
            scenario.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Scenario updated!' });
            });

        });
    });

    app.delete('/scenarios/:scenario_id',function(req,res){
       Scenario.remove({
            _id: req.params.scenario_id
        }, function(err, scenario) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });





















   // app.get('*',isLoggedIn);





};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
