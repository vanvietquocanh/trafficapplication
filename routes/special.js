var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
	  	var admin =`<li>
		       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
		    		</li>`;
		res.render("special",{
			"name"  : req.user.displayName,
			"avatar": req.user.photos[0].value,
			"admin" : admin,
			"title" : "Special Offers"
		})
	}else{
		res.redirect("/")
	}
});

module.exports = router;
