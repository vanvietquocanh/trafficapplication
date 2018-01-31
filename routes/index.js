var express = require('express');
var router = express.Router();

const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = 'mongodb://127.0.0.1:27017/admintraffic';

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		try{
				var query = {
					"idFacebook": req.user.id
 				}
 				var today = new Date();
 				var strToday = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
 				var dataInsert = {
 					"idFacebook": req.user.id,
 					"profile"   : req.user,
 					"timeregis" : strToday,
 					"report" 	: [],
					"admin"     : false,
					"master"    : false,
					"member"    : false
 				}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						function renderPage(route, admin){
							res.render(route,{
								"name"  : req.user.displayName,
								"avatar": req.user.photos[0].value,
								"admin" : admin
							})
							res.end();
						}
						if(result){
								var admin = `<li>
		                               			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
		                            		</li>`;
							if(result.member){
		                            renderPage("offers",admin)
							}else if(result.admin||result.master){
		                        renderPage("index", admin)
							}else{
								res.render("error",{
									error:{
										status: 404,
										stack : "Please wait for approval from the administrator!!!"
									}, message: "Not Found"
								})
							}
							assert.equal(null,err);
							db.close();
						}else{
							db.collection('userlist').insertOne(dataInsert,(err,result)=>{
							})
							res.render("error",{
								error:{
									status: 404,
									stack : "Please wait for approval from the administrator!!!"
								}, message: "Not Found"
							})
							res.end();
						};
						assert.equal(null,err);
						db.close();
					});
			});
		}catch(e){
			res.redirect("/")
			res.end();
		}
	}else{
		res.redirect("/")
		res.end();
	}
});

module.exports = router;
