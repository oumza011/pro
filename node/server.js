//bacend
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('./db');
const newProfileModel = require('./new_profile_schema');
const { param } = require('jquery');
const fs = require('fs');
var resizebase64 = require('resize-base64');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.get('/', (req, res) => {
    res.end('welcome to my word');
})
app.get('/checkuser', (req, res) => {
    var username = req.query.username;
    newProfileModel.find({ "username": username }, function(err, doc) {
        if (err) res.json({ result: "failed" });
        res.json({ result: doc.length });
    })
})
app.post('/upload', (req, res) => {
    fs.writeFile('./src/assets/img/' + req.body.names, req.body.base64, { encoding: 'base64' }, function(err) {
        if (err) res.json({ result: req });
        res.json({ result: "success" });
    });
})
app.post('/login', (req, res) => {
    var md5 = require('md5');
    const username = req.body.username;
    const password = md5(req.body.password);
    newProfileModel.find({ "username": username, "password": password }, function(err, doc) {
            if (err) res.json({ result: "failed" });
            res.json(doc);
        })
        // res.json({ result: "Success", username: username, password: password });
})
app.post('/updateprofile', (req, res) => {
    var md5 = require('md5');
    var oldpass = '';
    var dub = 0;
    var sppass = new Array(5);
    newProfileModel.find({ "username": req.body.username }, function(err, doc) {
        if (err) {
            res.json({ result: "failed" });
        } else {
            oldpass = doc[0].password;
            if (doc[0].old_password != null || doc[0].old_password != '') {
                oldpass += ',' + doc[0].old_password;
                sppass = oldpass.split(',');
            } else {
                sppass[0] = oldpass;
            }
            console.log(sppass);
            oldpass = '';
            for (var i = 0; i < 5; i++) {
                if (i == 0) {
                    oldpass += sppass[i];
                } else {
                    oldpass += ',' + sppass[i];
                }
                if (md5(req.body.password) == sppass[i]) {
                    dub = 1;
                }
            }
            if (dub != 0) {
                res.json({ result: "777", code: "รหัสซ้ำ" });
            } else {
                const date = new Date();
                const data = {
                    "fname": req.body.fname,
                    "lname": req.body.lname,
                    "update_dtm": date
                };
                if (req.body.password != '' && req.body.oldPassword != '') {
                    data['password'] = md5(req.body.password);
                    data['old_password'] = oldpass;
                }
                if (req.body.pic_profile != '') {
                    data['pic_profile'] = req.body.pic_profile;
                }
                // console.log(data);
                if (dub == 0) {
                    newProfileModel.findOneAndUpdate({ "username": req.body.username }, data, (err, doc) => {
                        if (err) {
                            res.json({ result: "failed" });
                        } else {
                            newProfileModel.find({ "username": req.body.username }, function(err, doc) {
                                if (err) res.json({ result: "failed read" });
                                res.json(doc);
                            })
                        }
                    })
                }
            }
        }
    })

})
app.post('/register', (req, res) => {
    var md5 = require('md5');
    const username = req.body.username;
    const password = md5(req.body.password);
    const fname = req.body.fname;
    const lname = req.body.lname;
    const pic_profile = req.body.pic_profile;
    const date = new Date();
    const data = {
        "username": username,
        "password": password,
        "fname": fname,
        "lname": lname,
        "pic_profile": pic_profile,
        "old_password": null,
        "create_dtm": date.toISOString(),
        "update_dtm": null
    };
    newProfileModel.create(data, (err, doc) => {
        if (err) {
            res.json({ result: "failed", data });
        } else {
            res.json({ result: "Success", data });
        }
    })

})
app.listen(3000, () => {
    console.log('server is running.....');
})