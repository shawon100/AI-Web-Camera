var express=require('express');
var app=express();
app.use(express.static('public/images'));

app.get('/',function(req,res){
	res.sendfile('index.html');
});

app.listen(5000,function(){

	console.log("Server is Running On localhost:5000");
});