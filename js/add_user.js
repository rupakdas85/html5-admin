function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
	hash = hashes[i].split('=');
	vars.push(hash[0]);
	vars[hash[0]] = hash[1];
	}
	return vars;
}
if(localStorage.getItem("login") != 'true') {
	window.location.href = 'index.html';
}
$(document).ready(function(){
	var hash = getUrlVars();
	var user_id_edit = hash['id'];
	if(user_id_edit != null){
		$("#save_user").val("Update");
		var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql('SELECT * from users where id = '+user_id_edit+'', [], querySuccess, errorQuery);
			function querySuccess(tx, results) {
				var user_count = results.rows.length;
				if(user_count > 0){
						//console.log(results.rows.item(0));return false;
						$("#full_name").val(results.rows.item(0).fullname);
						$("#user_id").val(results.rows.item(0).user_name);
						$("#upass,#c_upass").val(results.rows.item(0).password);
						$("#user_type").val(results.rows.item(0).rule);				
				}
			}
			function errorQuery(){
				alert("Error while retriving records!!");
			}
		});
	}
	//var pageurl = self.location.hostname+'/html5_admin/';
	var i = 0;
	var j=0;
	var maxQueueSize = 5;
	var queueSize = 0;
	var settings = {
	url: 'image_upload.php?type=4',
	method: "POST",
	allowedTypes:"jpg,png,gif,doc,pdf,zip",
	fileName: "myfile",
	multiple: true,
	onSuccess:function(files,data,xhr)
	{
		$("#status").html("<font color='green'>Upload is success</font>");
		$("#ids").append("<input type='hidden' name='last_id[]' value='"+data+"'>");
	},
	onError: function(files,status,errMsg)
	{		
		$("#status").html("<font color='red'>Upload is Failed</font>"); 
	}
}
$("#mulitplefileuploader").uploadFile(settings);
	//validation
	$("#user_id").keyup(function(){
		$("#err_id").css('display','none')
		$("#err_id").html('');							
	});
	$("#full_name").keyup(function(){
		$("#err_fname").css('display','none')
		$("#err_fname").html('');							
	});
	$("#upass").keyup(function(){
		$("#err_upass").css('display','none')
		$("#err_upass").html('');							
	});
	$("#c_upass").keyup(function(){
		$("#err_c_upass").css('display','none')
		$("#err_c_upass").html('');							
	});	
	$("#user_type").keyup(function(){
		$("#err_utype").css('display','none')
		$("#err_utype").html('');							
	});
	$("#save_user").click(function(){
	if($("#full_name").val() == ''){
		$("#err_fname").css('display','block')
		$("#err_fname").html('User name required!!');
	}else if($("#user_id").val() == ''){
		$("#err_id").css('display','block')
		$("#err_id").html('User ID required!!');
	}else if($("#upass").val() == ''){
		$("#err_upass").css('display','block')
		$("#err_upass").html('Password required!!');
	}else if($("#c_upass").val() == ''){
		$("#err_c_upass").css('display','block')
		$("#err_c_upass").html('Confirm Password!!');
	}else if($("#upass").val()!= $("#c_upass").val()){
		alert("Password doesnot match!!");
	}else if($("#user_type").val() == ''){
		$("#err_utype").css('display','block')
		$("#err_utype").html('User Type required!!');
	}else{
		//Get field values
		var full_name = $("#full_name").val();
		var user_id = $("#user_id").val();
		var upass = $("#upass").val();
		var user_type = $("#user_type").val();
		var user_img= "NA";
		//insert to data base
		var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			//tx.executeSql('DROP TABLE IF EXISTS users');
		tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,fullname VARCHAR(100), user_name VARCHAR(100), password VARCHAR(100),rule VARCHAR(100), image VARCHAR(100), status INTEGER)');	
		if(user_id_edit != null){
			//alert(0)
			tx.executeSql('UPDATE users set fullname = "'+full_name+'", user_name = "'+user_id+'",password = "'+upass+'", rule = "'+user_type+'", image = "'+user_img+'" where id = '+user_id_edit+'', [], querySuccess, errorQuery);
		}else{
			tx.executeSql('INSERT INTO users (id, fullname, user_name, password,rule, image, status) VALUES (NULL,"'+full_name+'","'+user_id+'","'+upass+'","'+user_type+'","'+user_img+'",1)', [], querySuccess, errorQuery);
			
		}
		//location.reload();
		function querySuccess(){
			window.location.href = "user.html";
		}
		function errorQuery(){
			alert("Something went wrong!!");
		}
		});	
	}
	});		
});