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
	var brand_id_edit = hash['id'];
	if(brand_id_edit != null){
		$("#save_brand").val("Update");
		var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql('SELECT * from brands where id = '+brand_id_edit+'', [], querySuccess, errorQuery);
			function querySuccess(tx, results) {
				var cat_count = results.rows.length;
				if(cat_count > 0){						
						$("#brand_name").val(results.rows.item(0).brand_name);
						$("#brnd_desc").html(results.rows.item(0).desc);
					
				}
			}
			function errorQuery(){
				alert("Error while retriving records!!");
			}
		});
	}
	//rNd going on ....
	//var pageurl = self.location.hostname+'/html5_admin/';
	var i = 0;
	var j=0;
	var maxQueueSize = 5;
	var queueSize = 0;
	var settings = {
	url: 'image_upload.php?type=3',
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

$("#brand_name").keyup(function(){
			$("#err_bname").css('display','none')
			$("#err_bname").html('');							
		});
	$("#save_brand").click(function(){
	if($("#brand_name").val() == ''){
		$("#err_bname").css('display','block')
		$("#err_bname").html('Brand name required!!');
	}else{
		$("#err_bname").html('');
		$("#err_bname").css('display','none')
			//Get field values
		var brand_name = $("#brand_name").val();
		//var brand_image= $("#p_cat_id").val();
		var brand_desc = $("#brnd_desc").val();
		//insert to data base
		var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
		db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS brands (id INTEGER PRIMARY KEY AUTOINCREMENT, brand_name VARCHAR(100), desc VARCHAR(250), display_status INTEGER)');
		if(brand_id_edit != null){
			tx.executeSql('UPDATE brands set brand_name = "'+brand_name+'", desc = "'+brand_desc+'" where id = '+brand_id_edit+'', [], querySuccess, errorQuery);
		}else{
			tx.executeSql('INSERT INTO brands (id, brand_name, desc, display_status) VALUES (NULL,"'+brand_name+'","'+brand_desc+'",1)', [], querySuccess, errorQuery);
		}
		//location.reload();
		function querySuccess(tx, results){
			 //alert('Returned ID: ' + results.insertId);
			window.location.href = "brand_manage.html";
		}
		function errorQuery(){
			alert("Something went wrong!!");
		}
		});	
	}
	});		
});