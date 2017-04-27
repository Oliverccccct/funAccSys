// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../models/user.js');
mongoose.connect('mongodb://localhost/FundAccount');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'index' });
});


/*login*/
router.get('/login', function(req, res) {
    res.render('login', { title: 'login' });
});


/*logout*/
router.get('/logout', function(req, res) {
    res.render('logout', { title: 'logout' });
});


/*register*/
router.get('/register', function(req, res) {
    res.render('register', { title: 'register' });
});


router.post('/register', function (req, res) {
    var userid_ = req.body.userid
        , password_ = req.body.password
        , email_ = req.body.email
        , birth_ = req.body.birthday
        ;
    var register_user = {
        userid: userid_,
        password: password_,
        email: email_,
        birth: birth_
    };
    user.findUser({userid: userid_}, function(err, doc) {
        if (err) {
            console.log('not found, and err is ', err.errors);
        } else {
            console.log('no err, and find user is ', doc, doc.length);
            if (doc.length === 0) {
// 该用户名还未被注册
                user.add(register_user, function(err) {
                    if (err) {
                        res.render('regstate', {state: "注册失败！", err: err.errors});
                    } else {
                        res.render('regstate', {state: "注册成功！", err: null});
                        // res.redirect('/login');
                    }
                });
            } else {
                console.log('用户名已经存在！');
                res.render('regstate', {state: "注册失败！", err: '用户名已经存在'});
            }
        }
    })
})

/*hompage*/
router.post('/homepage', function(req, res) {
    var query_doc = {userid: req.body.userid, password: req.body.password};
    (function(){
        user.user.count(query_doc, function(err, doc){
            if(doc == 1){
                console.log(query_doc.userid + ": login success in " + new Date());
                res.render('homepage', { title: query_doc.userid });
            }else{
                console.log(query_doc.userid + ": login failed in " + new Date());
                res.redirect('/');
            }
        });
    })(query_doc);
});

module.exports = router;