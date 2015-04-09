var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
	if(localStorage.getItem("login") != 'true'){
		window.location.href = 'index.html';
	}
	Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
$(document).ready(function() {
	db.transaction(function (tx) {
	//tx.executeSql('DROP TABLE IF EXISTS brands');
	tx.executeSql('CREATE TABLE IF NOT EXISTS offers (id INTEGER PRIMARY KEY AUTOINCREMENT,offer_name VARCHAR(100), offer_type VARCHAR(100), start_date VARCHAR(100),end_date VARCHAR(100), dis_by VARCHAR(100),amount VARCHAR(100), min_purchase VARCHAR(100), applied_cat text, status INTEGER(1))');	
	tx.executeSql("SELECT * FROM offers", [], querySuccess, errorQuery);
	function querySuccess(tx, results) {
	var dataSet_offer= [];
	var offer_count = results.rows.length;
		if(offer_count > 0){
			var k =1;
		for (var i=0; i<offer_count; i++){
			var id    = results.rows.item(i).id;
			var offer_name = results.rows.item(i).offer_name;
			var offer_type = results.rows.item(i).offer_type;
			var start_date = results.rows.item(i).start_date;
			var end_date = results.rows.item(i).end_date;
			var min_purchase = results.rows.item(i).min_purchase;
			var status = results.rows.item(i).status;
			
			if(status){
				var is_active = '<li style="padding-left:2px;margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="disable_offer('+id+')"><img src="img/red.png" style="margin-right:13px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Unpublish</font></a></li>';
			}else{
				var is_active = '<li style="margin-left: 15px;"><a style="text-decoration:none" href="javascript: void(0)" onclick="enable_offer('+id+')"><img src="img/green_status.png" style="margin-right:5px;margin-bottom:-4px;" border="0"/><font class="hreaf_hv">Publish</font></a></li>';
				
			}
			var temp_arry_offer = [];
			temp_arry_offer[0] = k;
			temp_arry_offer[1] = offer_name;
			temp_arry_offer[2] = offer_type;
			temp_arry_offer[3] = start_date;
			temp_arry_offer[4] = end_date;
			temp_arry_offer[5] = min_purchase;
			temp_arry_offer[6] = '<div style="width:60%;text-align:right;"><a href="javascript:void(0);"><img src="img/action_img.png" onclick="openpopup('+k+')" border="0"/></a></div><div style="width:60%;display:none;position:relative;" id="popup'+k+'"><div class="pop_arrow_new" style="position:relative; z-index:99;left:120px;"></div><div class="popup_con" align="left"> <div class="action_image"> <ul> <li style="margin-left: 15px;"><a style="text-decoration:none" href="add_offer.html?id='+id+'"><img src="img/edit.png" style="margin-right:6px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Edit Offer</font></a></li>'+is_active+'<li style="padding-left:2px;margin-left: 15px;background:none;"><a style="text-decoration:none" href="javascript: void(0)" onclick="delete_offer('+id+')"><img src="img/delete.png" style="margin-right:11px;margin-bottom:-3px;" border="0"/><font class="hreaf_hv">Remove Offer</font></a></li></ul></div></div></div>';
			temp_arry_offer[7] = status;
			dataSet_offer.push(temp_arry_offer);
			k++;				
		}
		$("#no_offer_msg").html('');
		}else{
			
			//$("#no_offer_msg").css({"color":"red","font-size":"14px","font-family":"Verdana,Geneva, sans-serif"}).html("You have not added any offer yet!!");
			tx.executeSql('INSERT INTO offers (id, offer_name, offer_type, start_date,end_date, dis_by, amount,min_purchase,applied_cat,status) VALUES (NULL,"Super Sale","Festval offer","'+new Date().toDateInputValue()+'","'+new Date().toDateInputValue()+'","Rs","100","1000","ALL",1)');
			tx.executeSql('INSERT INTO offers (id, offer_name, offer_type, start_date,end_date, dis_by, amount,min_purchase,applied_cat,status) VALUES (NULL,"IPL Sale","IPLT offer","'+new Date().toDateInputValue()+'","'+new Date().toDateInputValue()+'","%","50","2000","ALL",1)');
			tx.executeSql('INSERT INTO offers (id, offer_name, offer_type, start_date,end_date, dis_by, amount,min_purchase,applied_cat,status) VALUES (NULL,"Worldcup offer","Worldcup","'+new Date().toDateInputValue()+'","'+new Date().toDateInputValue()+'","%","70","5000","ALL",1)');
			location.reload();
		}
		$('#all_offer').dataTable({
			"data": dataSet_offer,
			"columns": [
			{ "title": "SL#" },
			{ "title": "Name" },
			{ "title": "Type" },
			{ "title": "Start Date" },
			{ "title": "End Date" },
			{ "title": "Min Purchase" },
			{ "title": "Action", "class": "center","bSortable": false, "width": "20%"  }
			],
		"fnRowCallback": function (nRow, dataSet_brand, iDisplayIndex, iDisplayIndexFull) {
			$(this).addClass('tbl_header');
			var status = dataSet_brand[7];
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
		$("#add_new_offer").click(function(){
			window.location.href = "add_offer.html";								   
		});
	});
	function delete_offer(id){
		if(confirm('Are you sure you want to delete?')){
			db.transaction(function (tx) {
			tx.executeSql('DELETE FROM offers where id='+id+'');
			location.reload();
		});	
		}
	}
	function enable_offer(id){
		if(confirm('Are you sure you want to publish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE offers SET status = 1 where id='+id+'');
			location.reload();
		});	
		}
	}
	function disable_offer(id){
		if(confirm('Are you sure you want to unpublish?')){
			db.transaction(function (tx) {
			tx.executeSql('UPDATE offers SET status = 0 where id='+id+'');
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