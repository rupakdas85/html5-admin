 $(document).ready(function(){
	var db = window.openDatabase('myadmin', '1.0', 'my admin', 5 * 1024 * 1024);
	db.transaction(function (tx) { 
		//tx.executeSql('DROP TABLE IF EXISTS users');
		tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,fullname VARCHAR(100), user_name VARCHAR(100), password VARCHAR(100),rule VARCHAR(100), image VARCHAR(100), status INTEGER)');
		tx.executeSql("SELECT * FROM users", [], qrySuccess, errorQuery);
		function qrySuccess(tx, res) {
				var if_user_exists = res.rows.length;				
				if(!if_user_exists){
					tx.executeSql('INSERT INTO users (id, fullname, user_name, password,rule,image, status) VALUES (NULL,"Rupak Das","uidg","uidg","Super Admin","NA",1)');							
					tx.executeSql('INSERT INTO users (id, fullname, user_name, password,rule,image, status) VALUES (NULL,"Vijay Wadnere","wvijay","wvijay","Super Admin","NA",1)');
					tx.executeSql('INSERT INTO users (id, fullname, user_name, password,rule,image, status) VALUES (NULL,"Mangesh Sankar","mangesh","mangesh","Admin","NA",1)');
				}			
			}
		function errorQuery(tx, results) {
					alert("Error on query");
			}
		
	});
	//Enter key submit
	$("input").keypress(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			login();
		}
	});
	//when user clicked on submit
	$("#btn_login").click(function(){login()});	
});

function login(){
	var validator = $("#signin_form").validate({
		rules: {
			"uname":{required: true},
			"password":{required: true}
		},	
		messages: {
			"uname":{
				required:"<br><font color='#FF0000' size='2'>Enter user id!</font>"
			},
			"password":{
				required:"<br><font color='#FF0000' size='2'>Enter password!</font>"
			}
		}
	});
	if(validator.form()){
		var uname = $("#uname").val();
		var pwd = $("#password").val();
		var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
		db.transaction(function (tx) {  
			tx.executeSql("SELECT * FROM users where user_name = '"+uname+"' and password = '"+pwd+"'", [], querySuccess, errorQuery);
			function querySuccess(tx, results) {
				var user_exists = results.rows.length;
				if(user_exists){
					var full_name = results.rows.item(0).fullname;
					localStorage.setItem("login", "true");
					localStorage.setItem("user_name",full_name);
					window.location.href = 'dashboard.html';
				}else{
					localStorage.setItem("login", "false");
					alert("Login error!!");
					return false;
				}				
			}
			function errorQuery(tx, results) {
					alert("Error on query");
			}			
		});
	}else{
		return false;
	}
}