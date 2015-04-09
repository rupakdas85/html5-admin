var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
	if(localStorage.getItem("login") != 'true'){
		window.location.href = 'index.html';
	}
$(document).ready(function() {
	db.transaction(function (tx) {
	//tx.executeSql('DROP TABLE IF EXISTS brands');
	tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,fullname VARCHAR(100), user_name VARCHAR(100), password VARCHAR(100),rule VARCHAR(100), image VARCHAR(100), status INTEGER)');	
	tx.executeSql("SELECT * FROM users", [], querySuccess, errorQuery);
	function querySuccess(tx, results) {
	var dataSet_user = [];
	var user_count = results.rows.length;
		if(user_count > 0){
			var k =1;
		for (var i=0; i<user_count; i++){
			var id    = results.rows.item(i).id;
			var fullname = results.rows.item(i).fullname;
			var user_name = results.rows.item(i).user_name;
			var rule = results.rows.item(i).rule;
			//var user_img = results.rows.item(i).image;
			var user_img = "<img src='img/users/images.jpg' alt='User' height='40' width='40'>";
			var status = results.rows.item(i).status;
			if(status){
				var is_active = '<li style="padding-left:2px;margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="disable_user('+id+')"><img src="img/red.png" style="margin-right:13px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Disable</font></a></li>';
			}else{
				var is_active = '<li style="margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="enable_user('+id+')"><img src="img/green_status.png" style="margin-right:5px;margin-bottom:-4px;" border="0"/><font class="hreaf_hv">Enable</font></a></li>';
				
			}
			var temp_arry_user = [];
			temp_arry_user[0] = k;
			temp_arry_user[1] = fullname;
			temp_arry_user[2] = user_name;
			temp_arry_user[3] = rule;
			temp_arry_user[4] = user_img;
			temp_arry_user[5] = '<div style="width:60%;text-align:right;"><a href="javascript:void(0);"><img src="img/action_img.png" onclick="openpopup('+k+')" border="0"/></a></div><div style="width:60%;display:none;position:relative;" id="popup'+k+'"><div class="pop_arrow_new" style="position:relative; z-index:99;left:120px;"></div><div class="popup_con" align="left"> <div class="action_image"> <ul> <li style="margin-left: 15px;"><a style="text-decoration:none" href="add_user.html?id='+id+'"><img src="img/edit.png" style="margin-right:6px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Edit User</font></a></li>'+is_active+'<li style="padding-left:2px;margin-left: 15px;background:none;"><a style="text-decoration:none" href="javascript: void(0)" onclick="remove_user('+id+')"><img src="img/delete.png" style="margin-right:11px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Remove User</font></a></li></ul></div></div></div>';
			temp_arry_user[6] = status;
			dataSet_user.push(temp_arry_user);
			k++;				
		}
		//$("#no_user_msg").html('');
		}else{
			
			//$("#no_user_msg").css({"color":"red","font-size":"14px","font-family":"Verdana,Geneva, sans-serif"}).html("You have not added any user yet!!");
			tx.executeSql('INSERT INTO users (id, fullname, user_name, password,rule,image, status) VALUES (NULL,"Rupak Das","uidg","uidg","Super Admin","NA",1)');
			tx.executeSql('INSERT INTO users (id, fullname, user_name, password,rule,image, status) VALUES (NULL,"Vijay Wadnere","wvijay","wvijay","Super Admin","NA",1)');
			tx.executeSql('INSERT INTO users (id, fullname, user_name, password,rule,image, status) VALUES (NULL,"Mangesh Sankar","mangesh","mangesh","Admin","NA",1)');
			location.reload();
		}
		$('#all_brand').dataTable({
			"data": dataSet_user,
			"columns": [
			{ "title": "SL#" },
			{ "title": "Name" },
			{ "title": "UserID" },
			{ "title": "Rule" },
			{ "title": "Image","bSortable": false },
			{ "title": "Action", "class": "center","bSortable": false, "width": "20%"  }
			],
		"fnRowCallback": function (nRow, dataSet_brand, iDisplayIndex, iDisplayIndexFull) {
			$(this).addClass('tbl_header');
			var status = dataSet_user[6];
			if(status == 0){ 
				$(nRow).addClass('row-inactive');
			}
		}
		}); 
	}
	function errorQuery(tx, results) {
			alert("error on query");
	}
	});	
		$("#add_new_user").click(function(){
			window.location.href = "add_user.html";								   
		});
	});
	function remove_user(id){
		if(confirm('Are you sure you want to delete?')){
			db.transaction(function (tx) {
			tx.executeSql('DELETE FROM users where id='+id+'');
			location.reload();
		});	
		}
	}
	function enable_user(id){
		if(confirm('Are you sure you want to enable?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE users SET status = 1 where id='+id+'');
			location.reload();
		});	
		}
	}
	function disable_user(id){
		if(confirm('Are you sure you want to disable?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE users SET status = 0 where id='+id+'');
			location.reload();
		});	
		}
	}
	function openpopup(id){ 
		$("div:visible[id*='popup']").not($("#popup"+id)).each(function() {
			$(this).hide();
		});
		if($("#popup"+id).css('display') == 'none'){
			$("#popup"+id).show();
		}else{
			$("#popup"+id).hide();
		}
	}