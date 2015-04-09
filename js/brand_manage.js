var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
	if(localStorage.getItem("login") != 'true'){
		window.location.href = 'index.html';
	}
$(document).ready(function() {
	db.transaction(function (tx) {
	//tx.executeSql('DROP TABLE IF EXISTS brands');
	tx.executeSql('CREATE TABLE IF NOT EXISTS brands (id INTEGER PRIMARY KEY AUTOINCREMENT, brand_name VARCHAR(100), desc VARCHAR(250), display_status INTEGER)');	
	tx.executeSql("SELECT * FROM brands", [], querySuccess, errorQuery);
	function querySuccess(tx, results) {
	var dataSet_brand = [];
	var cat_count = results.rows.length;
		if(cat_count > 0){
			var k =1;
		for (var i=0; i<cat_count; i++){
			var id    = results.rows.item(i).id;
			var name = results.rows.item(i).brand_name;
			var brand_desc = results.rows.item(i).desc;
			//var cat_img	 = "No Image"
			var display_status = results.rows.item(i).display_status;
			if(brand_desc.length > 30)
			{
				var short_brand_desc = brand_desc.substring(0,30)+".....";
			}
			else{
				var short_brand_desc = brand_desc;
			}
			if(display_status){
				var is_active = '<li style="padding-left:2px;margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="disable_brand('+id+')"><img src="img/red.png" style="margin-right:13px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Unpublish</font></a></li>';
			}else{
				var is_active = '<li style="margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="enable_brand('+id+')"><img src="img/green_status.png" style="margin-right:5px;margin-bottom:-4px;" border="0"/><font class="hreaf_hv">Publish</font></a></li>';
				
			}
			var temp_arry_brand = [];
			temp_arry_brand[0] = k;
			temp_arry_brand[1] = name;
			temp_arry_brand[2] = short_brand_desc;
			temp_arry_brand[3] = '<div style="width:60%;text-align:right;"><a href="javascript:void(0);"><img src="img/action_img.png" onclick="openpopup('+k+')" border="0"/></a></div><div style="width:60%;display:none;position:relative;" id="popup'+k+'"><div class="pop_arrow_new" style="position:relative; z-index:99;left:120px;"></div><div class="popup_con" align="left"> <div class="action_image"> <ul> <li style="margin-left: 15px;"><a style="text-decoration:none" href="add_brand.html?id='+id+'"><img src="img/edit.png" style="margin-right:6px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Edit Brand</font></a></li>'+is_active+'<li style="padding-left:2px;margin-left: 15px;background:none;"><a style="text-decoration:none" href="javascript: void(0)" onclick="delete_brand('+id+')"><img src="img/delete.png" style="margin-right:11px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Delete Brand</font></a></li></ul></div></div></div>';
			temp_arry_brand[4] = display_status;
			dataSet_brand.push(temp_arry_brand);
			k++;				
		}
		$("#no_brand_msg").html('');
		}else{
			
			//$("#no_brand_msg").css({"color":"red","font-size":"14px","font-family":"Verdana,Geneva, sans-serif"}).html("You have not added any brand yet!!");
			tx.executeSql('INSERT INTO brands (id, brand_name, desc, display_status) VALUES (NULL,"Puma","All Puma Product",1)');
			tx.executeSql('INSERT INTO brands (id, brand_name, desc, display_status) VALUES (NULL,"Addida","All Addida Product",1)');
			tx.executeSql('INSERT INTO brands (id, brand_name, desc, display_status) VALUES (NULL,"Samsung","All Samsung Product",1)');
			tx.executeSql('INSERT INTO brands (id, brand_name, desc, display_status) VALUES (NULL,"Lenove","All Lenove Product",1)');
			location.reload();
		}
		$('#all_brand').dataTable({
			"data": dataSet_brand,
			"columns": [
			{ "title": "SL#" },
			{ "title": "Name" },
			{ "title": "Description" },
			{ "title": "Action", "class": "center","bSortable": false, "width": "20%"  }
			],
		"fnRowCallback": function (nRow, dataSet_brand, iDisplayIndex, iDisplayIndexFull) {
			$(this).addClass('tbl_header');
			var status = dataSet_brand[4];
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
		$("#add_new_brand").click(function(){
			window.location.href = "add_brand.html";								   
		});
	});
	function delete_brand(id){
		if(confirm('Are you sure you want to delete?')){
			db.transaction(function (tx) {
			tx.executeSql('DELETE FROM brands where id='+id+'');
			location.reload();
		});	
		}
	}
	function enable_brand(id){
		if(confirm('Are you sure you want to publish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE brands SET display_status = 1 where id='+id+'');
			location.reload();
		});	
		}
	}
	function disable_brand(id){
		if(confirm('Are you sure you want to unpublish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE brands SET display_status = 0 where id='+id+'');
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