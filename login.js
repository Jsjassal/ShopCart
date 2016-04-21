var storage = require('node-persist');
storage.initSync();

var account = {
	email : "srinigopishetty@gmail.com",
	pwd : "Welcome1"
};

// newAccount.name = "Srinivas Gopishetty";
// newAccount.email = "srinigopishetty@gmail.com";
// newAccount.pwd = "Welcome1";

var accounts = storage.getItemSync('accounts');
accounts.forEach(function  (account) {
	if (account.email === account.email && account.pwd === account.pwd) {
		console.log("True");
	}else{
		console.log("FAlse");
	}
		
});




