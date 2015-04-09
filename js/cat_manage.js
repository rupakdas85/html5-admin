var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
	if(localStorage.getItem("login") != 'true') {
		window.location.href = 'index.html';
	}
	function open_cat_popup(id){
		$("#CategoryCatName").val($("#name"+id).val());	
		$('#p_cat_id ').val($("#pname"+id).val());
		$("#cat_desc").html($("#desc"+id).val());
		$(".cat_heading").html("<u>Edit Category</u>");
		$("#add_new_cat").val("Update");
		$("#to_edit").val(id);
		$("#add_cat_popup").fadeIn();
	}
	$(document).ready(function() {
		$("#add_category_new").click(function(){
			$("#CategoryCatName").val('');
			//$("#p_cat_id").find('option[value="shoes"]').attr('selected','selected');
			$(".cat_heading").html("<u>Add new Category</u>");
			$("#add_new_cat").val("Submit");
			$("#cat_desc").html('');
			$("#to_edit").val('');
			$("#add_cat_popup").fadeIn();
		});
	$("#pop_close").click(function(){
			$("#add_cat_popup").fadeOut();
		});
	//var pageurl = self.location.hostname+'/html5_admin/';
	var i = 0;
	var j=0;
	var maxQueueSize = 5;
	var queueSize = 0;
	var settings = {
	url:'image_upload.php?type=2',
	//url: pageurl+'image_upload.php/3',
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
	db.transaction(function (tx) {
	//tx.executeSql('DROP TABLE IF EXISTS categories');
	tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, cat_name VARCHAR(100),p_name VARCHAR(100), desc VARCHAR(250), display_status INTEGER)');	
	tx.executeSql("SELECT * FROM categories", [], querySuccess, errorQuery);
	function querySuccess(tx, results) {
	var cat_count = results.rows.length;
		var dataSet = [];
		if(cat_count > 0){
			var k =1;
		for (var i=0; i<cat_count; i++){
			var id    = results.rows.item(i).id;
			var name = results.rows.item(i).cat_name;
			var p_name = results.rows.item(i).p_name;
			var cat_desc = results.rows.item(i).desc;
			//var cat_img	 = '<img src="img/no-image.jpg" alt="no-image">'
			var display_status = results.rows.item(i).display_status;
			//alert(p_name)
			if(cat_desc.length > 30)
			{
				var short_cat_desc = cat_desc.substring(0,30)+".....";
			}
			else{
				var short_cat_desc = cat_desc;
			}
			$("#p_cat_id").append('<option val="'+name+'">'+name+'</option>');
			if(display_status){						
				var is_active = '<li style="padding-left:2px;margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="disable_cat('+id+')"><img src="img/red.png" style="margin-right:13px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Unpublish</font></a></li>';
			}else{
				var is_active = '<li style="margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="enable_cat('+id+')"><img src="img/green_status.png" style="margin-right:5px;margin-bottom:-4px;" border="0"/><font class="hreaf_hv">Publish</font></a></li>';
			}
			var temp_arry = [];
			temp_arry[0] = k;
			temp_arry[1] = name;
			temp_arry[2] = p_name;
			//temp_arry[2] = cat_img;
			temp_arry[3] = short_cat_desc;
			temp_arry[4] = '<div style="width:60%;text-align:right;"><a href="javascript:void(0);"><img src="img/action_img.png" onclick="openpopup('+k+')" border="0"/></a></div><div style="width:60%;display:none;position:relative;" id="popup'+k+'"><div class="pop_arrow_new" style="position:relative; z-index:99;left:120px;"></div><div class="popup_con" align="left"> <div class="action_image"> <ul> <li style="margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" class="edit_cat" onClick="open_cat_popup('+id+')"><img src="img/edit.png" style="margin-right:6px;margin-bottom:-3px;" border="0"/><font>Edit Category</font></a></li>'+is_active+'<li style="padding-left:2px;margin-left: 15px;background:none;"><a style="text-decoration:none" href="javascript: void(0)" onclick="delete_cat('+id+')"><img src="img/delete.png" style="margin-right:11px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Delete Category</font></a></li></ul></div></div><input type="hidden" id="name'+id+'" value="'+name+'"><input type="hidden" id="pname'+id+'" value="'+p_name+'"><input type="hidden" id="desc'+id+'" value="'+cat_desc+'"></div>';
			temp_arry[5] = display_status;
			dataSet.push(temp_arry);
			k++;
		}
	 	$("#no_cat_msg").html('');
		}else{
			//$("#no_cat_msg").css({"color":"red","font-size":"14px","font-family":"Verdana,Geneva, sans-serif"}).html("You have not added any category yet!!");
			tx.executeSql('INSERT INTO categories (id, cat_name,p_name, desc, display_status) VALUES (NULL,"Electronics","Electronics","Demo Desc",1)');
			tx.executeSql('INSERT INTO categories (id, cat_name,p_name, desc, display_status) VALUES (NULL,"Television","Electronics","All television",1)');
			tx.executeSql('INSERT INTO categories (id, cat_name,p_name, desc, display_status) VALUES (NULL,"Samsung Television","Television","All samsung television",1)');
			location.reload();
			
		}
	$('#all_cat').dataTable( {		
		"data": dataSet,
		 responsive: true,
		"columns": [
		{ "title": "SL#" },
		{ "title": "Name" },
		{ "title": "Parent", "class": "center" },
		{ "title": "Description" },
		{ "title": "Action", "class": "center","bSortable": false, "width": "20%"  }
		],
		"fnRowCallback": function (nRow, dataSet, iDisplayIndex, iDisplayIndexFull) {
			$(this).addClass('tbl_header');
			var status = dataSet[5];
			if(status == 0){ 
				$(nRow).addClass('row-inactive');
			}
		}
	} );
	
	/* var table = $('#all_cat').DataTable();
 
    $('#all_cat tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );*/
	}
	function errorQuery(tx, results) {
			alert("error on query");
	}
	});	
	//validate Category add form
	$("#CategoryCatName").keyup(function(){
		$("#err_catname").css('display','none')
		$("#err_catname").html('');							
	});
	$("#add_new_cat").click(function(){
		
	var err_flg = 0;
	if($("#CategoryCatName").val() == ''){
		$("#err_catname").css('display','block');
		$("#err_catname").html('Category name required!!');
		err_flg = 1;
	}
	/*if($("#p_cat_id").val() == ''){
		$("#err_subcatname").css('display','block');
		$("#err_subcatname").html('Please choose a sub category.');
		err_flg = 1;
	}*/
	if(err_flg == 1){
		return false;
	}else{
		
		$("#err_catname,#err_subcatname").html('');
		$("#err_catname,#err_subcatname").css('display','none');
		//Get field values
		var cat_name = $("#CategoryCatName").val();
		var p_cat = $("#p_cat_id").val();
		var p_desc = $("#cat_desc").val();
		//insert to data base
		db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, cat_name VARCHAR(100),p_name VARCHAR(100), desc VARCHAR(250), display_status INTEGER)');
			if($("#add_new_cat").val() == "Update" && $("#to_edit").val() != null){		
				tx.executeSql('UPDATE categories  SET cat_name = "'+cat_name+'",p_name = "'+p_cat+'", desc = "'+p_desc+'" where id = '+$("#to_edit").val()+'');
			}else{
				tx.executeSql('INSERT INTO categories (id, cat_name,p_name, desc, display_status) VALUES (NULL,"'+cat_name+'","'+p_cat+'","'+p_desc+'",1)');
			}
		location.reload();
	
	});	
	}	
});
});
	function delete_cat(id){
		if(confirm('Are you sure you want to delete?')){
			db.transaction(function (tx) {
			tx.executeSql('DELETE FROM categories where id='+id+'');
			location.reload();
		});	
		}
	}
	function enable_cat(id){
		if(confirm('Are you sure you want to publish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE categories SET display_status = 1 where id='+id+'');
			location.reload();
		});	
		}
	}
	function disable_cat(id){
		if(confirm('Are you sure you want to unpublish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE categories SET display_status = 0 where id='+id+'');
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