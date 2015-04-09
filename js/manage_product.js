var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
	if(localStorage.getItem("login") != 'true'){
		window.location.href = 'index.html';
	}
	$(document).ready(function() {
	db.transaction(function (tx) {
	//tx.executeSql('DROP TABLE IF EXISTS brands');
	tx.executeSql('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, pro_name VARCHAR(100),unit_avail INTEGER, desc VARCHAR(250), display_status INTEGER)');	
	tx.executeSql("SELECT * FROM products", [], querySuccess, errorQuery);
	function querySuccess(tx, results) {
	var dataSet_product = [];
	var prod_count = results.rows.length;
		if(prod_count > 0){
			var k =1;
		for (var i=0; i<prod_count; i++){
			var id    = results.rows.item(i).id;
			var name = results.rows.item(i).pro_name;			
			//var cat_img	 = "No Image"
			var unit_avail = results.rows.item(i).unit_avail;
			var prod_desc = results.rows.item(i).desc;
			var status = results.rows.item(i).display_status;			
			if(prod_desc.length > 30)
			{
				var short_prod_desc = prod_desc.substring(0,30)+".....";
			}
			else{
				var short_prod_desc = prod_desc;
			}
			if(status){
				var is_active = '<li style="margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="disable_product('+id+')"><img src="img/red.png" style="margin-right:5px;margin-bottom:-4px;" border="0"/><font class="hreaf_hv">Unpublish</font></a></li>';
			}else{
				var is_active = '<li style="padding-left:2px;margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="enable_product('+id+')"><img src="img/green_status.png" style="margin-right:13px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Publish</font></a></li>';
			}
			var temp_arry_prod = [];
			temp_arry_prod[0] = id;
			temp_arry_prod[1] = name;
			temp_arry_prod[2] = unit_avail;
			temp_arry_prod[3] = short_prod_desc;
			temp_arry_prod[4] = '<div style="width:60%;text-align:right;"><a href="javascript:void(0);"><img src="img/action_img.png" onclick="openpopup('+k+')" border="0"/></a></div><div style="width:60%;display:none;position:relative;" id="popup'+k+'"><div class="pop_arrow_new" style="position:relative; z-index:99;left:120px;"></div><div class="popup_con" align="left"> <div class="action_image"><ul> <li style="margin-left: 15px;"><a style="text-decoration:none" href=""><img src="img/edit.png" style="margin-right:6px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Edit Product</font></a></li>'+is_active+'<li style="padding-left:2px;margin-left: 15px;background:none;"><a style="text-decoration:none" href="javascript: void(0)" onclick="delete_prod('+id+')"><img src="img/delete.png" style="margin-right:11px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Delete Product</font></a></li></ul></div></div></div>';
			temp_arry_prod[5] = status;			
			dataSet_product.push(temp_arry_prod);			
			k++;				
		}
		$("#no_prod_msg").html('');
		}else{			
			//$("#no_prod_msg").css({"color":"red","font-size":"14px","font-family":"Verdana,Geneva, sans-serif"}).html("You have not added any product yet!!");
			tx.executeSql('INSERT INTO products (id, pro_name,unit_avail, desc, display_status) VALUES (NULL,"Moto G","12","Demo Desc",1)');
			tx.executeSql('INSERT INTO products (id, pro_name,unit_avail, desc, display_status) VALUES (NULL,"Lenovo a700","222","Some desc",1)');
			tx.executeSql('INSERT INTO products (id, pro_name,unit_avail, desc, display_status) VALUES (NULL,"Samsung Galaxys","300","Some desc",1)');
			location.reload();
		}
		
		$('#all_prod').dataTable({
			"data": dataSet_product,
			"columns": [
			{ "title": "id" },
			{ "title": "Name" },
			{ "title": "Unit Available" },
			{ "title": "Description" },
			{ "title": "Action", "class": "center","bSortable": false, "width": "20%" }
			],
			"fnRowCallback": function (nRow, dataSet_product, iDisplayIndex, iDisplayIndexFull) {
			$(this).addClass('tbl_header');
			var statuss = dataSet_product[5];
			
			if(statuss == 0){ 
				$(nRow).addClass('row-inactive');
			}
		}
		}); 
	}
	function errorQuery(tx, results) {
			alert("error on query");
	}
	});	
		$("#add_new_prod").click(function(){
			window.location.href = "add_product.html";								   
		});
	});
	function delete_prod(id){
		if(confirm('Are you sure you want to delete?')){
			db.transaction(function (tx) {
			tx.executeSql('DELETE FROM products where id='+id+'');
			location.reload();
		});	
		}
	}
	function enable_product(id){
		if(confirm('Are you sure you want to publish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE products SET display_status = 1 where id='+id+'');
			location.reload();
		});	
		}
	}
	function disable_product(id){
		if(confirm('Are you sure you want to unpublish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE products SET display_status = 0 where id='+id+'');
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