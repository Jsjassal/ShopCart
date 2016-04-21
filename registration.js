
var express = require('express');
var cookieParser = require('cookie-parser')
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var storage    =   require('node-persist');
storage.initSync();
var accounts = [];
var min = 10000;
var max = 99999;
var newUser = false;




app.use(bodyParser.json());
app.use(cookieParser());

app.get('/test', function  (req, res) {
	res.send("Hello!");

});


app.use(express.static(__dirname + '/public'));

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');

});

function createAccount(newAccount){
	//console.log("new one"+ newAccount);
	var accounts = [];

		

	if (storage.getItemSync('accounts') === undefined ) {
		accounts.push(newAccount);
		storage.setItemSync('accounts',accounts);
	}else{
		accounts = storage.getItemSync('accounts')
		accounts.push(newAccount);
		storage.setItemSync('accounts',accounts);
	}


	
}

function getAccounts() {
	var accountList = storage.getItemSync('accounts');
	//console.log("Iam in getAccounts :  " + accounts);
	return accountList;
}


function login(userAccount){
	
	var accounts = getAccounts();
	var mactchedAccount;

	// Iterate list of exisitng accounts. Find the match.
	accounts.forEach( function (account) {

		

		if (account.email === userAccount.email && account.pwd === userAccount.pwd ) {
			mactchedAccount = account;
		}
	});
	if (mactchedAccount) {

		//res.append('Set-Cookie', 'userAccount=userAccount.email; Path=/;');
		res.cookie('userAccount',userAccount.email );
		res.json(mactchedAccount);

	} else {

		//console.log(mactchedAccount);
		res.status(404).send();
	}
	
}



//POST /createaccount

app.post('/createaccount', function (req,res) {
	var body = req.body;
	createAccount(body);
	res.send("Your account is created!");
	
});


//POST /login
app.post('/login', function (req, res){

	var userAccount = req.body;
	var accounts = getAccounts();
	var mactchedAccount;
	//console.log(req.get('cookie'))
	//console.log(req.headers)
	//console.log("Cookies: ", req.cookies);
	//console.log("mycookie " + req.cookies.userAccount)

	// Iterate list of exisitng accounts. Find the match.
	accounts.forEach( function (account) {
		

		if (account.email === userAccount.email && account.pwd === userAccount.pwd ) {
			mactchedAccount = account;
		}
	});
	if (mactchedAccount) {
		//res.append('Set-Cookie', 'userAccount='+ userAccount.email+ '; Path=/; HttpOnly');
		//res.json("You are good to go Buddy!" + JSON.stringify(mactchedAccount));
		res.json("You are Authenticated" );
	} else {
		//console.log(mactchedAccount);
		res.status(404).send();
	}

	// res.send("Your account is created!");
	
});

function fillOrders(order,user){
    console.log("iam in fil orders");
	var num = Math.floor(Math.random() * (max - min + 1)) + min;
	var orderwoID = order;
	var usrOrderlst = [];
	var usersingleOrder = {};
	var userOrderbkt = {};
	var TotalOrderList = [];

	var orders = new Array();
	if (storage.getItemSync('orders') === undefined && storage.getItemSync('TotalOrderList') === undefined) {
		//console.log(order);
		num = Math.floor(Math.random() * (max - min + 1)) + min;
		console.log(num);
		orderwoID.orderId = num;
		//orderwoID.status = "shipping";
		//orderwoID.image = "adad";
		//orderwoID.user = user;
		orders.push(orderwoID);
		storage.setItemSync('orders',orders);
		userOrderbkt.user = user;
		usersingleOrder.id =  num;
		usersingleOrder.status = "shipping";
		usersingleOrder.image = "ready4Shipping.jpg";
		usrOrderlst.push(usersingleOrder);
		userOrderbkt.orders = usrOrderlst;
		TotalOrderList.push(userOrderbkt);



		storage.setItemSync('TotalOrderList',TotalOrderList)
		return "Your orderID "+num+ "  completed!";
		
	}else{
		//console.log("iam  there" + storage.getItemSync('orders'))
		num = Math.floor(Math.random() * (max - min + 1)) + min;
		//console.log(num);
		orderwoID.orderId = num;
		//orderwoID.status = "shipping";
		//orderwoID.image = "adas";
		//orderwoID.user = user;
		orders = storage.getItemSync('orders');
		console.log("array len -->"  + "contents -->" + orders)
		orders.push(orderwoID);
		storage.setItemSync('orders',orders);

		TotalOrderList = storage.getItemSync('TotalOrderList');
		console.log('existing orders' +TotalOrderList);
		//console.log(TotalOrderList);
		//userOrderbkt.user = user;
		usersingleOrder.id =  num;
		usersingleOrder.status = "shipping";
		usersingleOrder.image = "ready4Shipping.jpg";
		

		for (i=0; i < TotalOrderList.length; i++){
			if(TotalOrderList[i].user === user){
				console.log("userEsixt" + TotalOrderList[i].user);
				usrOrderlst = TotalOrderList[i].orders;
				usrOrderlst.push(usersingleOrder);
				TotalOrderList[i].orders = usrOrderlst;
				console.log("userORDER" + TotalOrderList[i].orders);
				newUser = false;
				break;
			}else{
				newUser = true;


			};
		}

		if (newUser) {
			console.log("iam in new user");
			TotalOrderList = storage.getItemSync('TotalOrderList');
			userOrderbkt.user = user;
			usersingleOrder.id =  num;
			usersingleOrder.status = "shipping";
			usersingleOrder.image = "ready4Shipping.jpg";
			usrOrderlst.push(usersingleOrder);
			userOrderbkt.orders = usrOrderlst;
			TotalOrderList.push(userOrderbkt);
		};

		// for(var userOrder in TotalOrderList){
		//     if (userOrder.user === user){
		//        usrOrderlst = userorder.orders
		       

		//     }
		// }
		
		
		//userOrderbkt.orders = usrOrderlst;
		//TotalOrderList.push(userOrderbkt);

		storage.setItemSync('TotalOrderList',TotalOrderList);
		usrOrderlst = [];
		usersingleOrder = {};
		userOrderbkt = {};
		TotalOrderList = [];
		//orders.length = 0;

		return "Your orderID "+num+ "  completed!";
	};	


}

app.post('/completeorder', function (req, res){
    
    console.log("here the json"+req.cookies.userAccount);
	var userOrder = req.body;

	console.log("here the json"+userOrder);

	if (userOrder !== null) {
		var status = fillOrders(userOrder,req.get('userAccount'));
		res.send(status);
	}
	
});

function getOrders(user){
TotalOrderList = storage.getItemSync('TotalOrderList');
	
var Orderlst;
		for(var userOrder in TotalOrderList){
			//console.log(TotalOrderList[userOrder].user);
		    if (TotalOrderList[userOrder].user === user){
		    	console.log(user);
		       Orderlst = TotalOrderList[userOrder].orders
		       console.log(Orderlst);
		    }
		}

return Orderlst;

}

app.get('/orders/:user', function (req, res){

	var userOrder = req.body;
	//console.log(req.cookies.userAccount);

	if (userOrder !== null) {
		var status = getOrders(req.params.user);
		res.send(status);
	}
	
});

function getProfile(user){
	var accounts = storage.getItemSync('accounts');
	console.log(accounts);
	var accnt = {};
	for(var account in accounts){
		if (accounts[account].email === user) {
			console.log("found user");
			accnt.name = accounts[account].name;
			accnt.email = accounts[account].email;
		};
	}
	return accnt;

}

app.get('/profile/:user', function (req, res){
		var account = getProfile(req.params.user);
		res.send(account);	
});

app.get('/itemList', function (req,res) {

	res.send(storage.getItemSync('itemList'));
	
});






