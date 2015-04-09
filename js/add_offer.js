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
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
$(document).ready(function(){
	$('#start_date,#end_date').val(new Date().toDateInputValue());
	
	var hash = getUrlVars();
	var offer_id_edit = hash['id'];
	if(offer_id_edit != null){
		$("#save_offer").val("Update");
		var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql('SELECT * from offers where id = '+offer_id_edit+'', [], querySuccess, errorQuery);
			function querySuccess(tx, results) {
				var offer_count = results.rows.length;
				if(offer_count > 0){
						$("#offer_name").val(results.rows.item(0).offer_name);
						$("#offer_type").val(results.rows.item(0).offer_type);
						$("#start_date").val(results.rows.item(0).start_date);
						$("#end_date").val(results.rows.item(0).end_date);
						$("#dis_type").val(results.rows.item(0).dis_by);
						$("#dis_amount").val(results.rows.item(0).amount);
						$("#min_pur").val(results.rows.item(0).min_purchase);
				}
			}
			function errorQuery(){
				alert("Error while retriving records!!");
			}
		});
	}
	//validation
	$("#offer_name").keyup(function(){
		$("#err_oname").css('display','none')
		$("#err_oname").html('');							
	});
	$("#offer_type").change(function(){
		$("#err_otype").css('display','none')
		$("#err_otype").html('');							
	});
	$("#start_date").keyup(function(){
		$("#err_sd").css('display','none')
		$("#err_sd").html('');							
	});
	$("#end_date").keyup(function(){
		$("#err_ed").css('display','none')
		$("#err_ed").html('');							
	});	
	$("#dis_type").change(function(){
		$("#err_dtype").css('display','none')
		$("#err_dtype").html('');							
	});
	$("#dis_amount").keyup(function(){
		$("#err_dis_amount").css('display','none')
		$("#err_dis_amount").html('');							
	});
	$("#min_pur").keyup(function(){
		$("#err_mp").css('display','none')
		$("#err_mp").html('');							
	});
	var err_flag = 0;
	$("#save_offer").click(function(){
	if($("#offer_name").val() == ''){
		$("#err_oname").css('display','block')
		$("#err_oname").html('Offer name required!!');
		err_flag = 1;
	}if($("#offer_type").val() == 0){
		$("#err_otype").css('display','block')
		$("#err_otype").html('Select offer type!!');
		 err_flag = 1;
	}if($("#start_date").val() == ''){
		$("#err_sd").css('display','block')
		$("#err_sd").html('Select offer start date!!');
		err_flag = 1;
	}if($("#end_date").val() == ''){
		$("#err_ed").css('display','block')
		$("#err_ed").html('Select offer start date!!');
		err_flag = 1;
	}if($("#dis_type").val() == 0){
		$("#err_dtype").css('display','block')
		$("#err_dtype").html('Choose discount type!!');
		err_flag = 1;
	}if($("#dis_amount").val() == ''){
		$("#err_dis_amount").css('display','block')
		$("#err_dis_amount").html('Enter discount amount!!');
		err_flag = 1;
	}if($("#min_pur").val() == ''){
		$("#err_mp").css('display','block')
		$("#err_mp").html('Enter minimum purshase!!');
		err_flag = 1;
	}
	if(err_flag == 1){
		return false;
	}
	else{
		//Get field values
		var offer_name = $("#offer_name").val();
		var offer_type = $("#offer_type").val();
		var start_date = $("#start_date").val();
		var end_date = 	$("#end_date").val();
		var dis_by= $("#dis_type").val();
		var amount = $("#dis_amount").val();
		var min_purchase = $("#min_pur").val();
		var applied_cat= $("#s_cat").val();
		//insert to data base
		var db = window.openDatabase('myadmin', '1.0', 'my admin', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			//tx.executeSql('DROP TABLE IF EXISTS users');
		tx.executeSql('CREATE TABLE IF NOT EXISTS offers (id INTEGER PRIMARY KEY AUTOINCREMENT,offer_name VARCHAR(100), offer_type VARCHAR(100), start_date VARCHAR(100),end_date VARCHAR(100), dis_by VARCHAR(100),amount VARCHAR(100), min_purchase VARCHAR(100), applied_cat text, status INTEGER(1))');	
		if(offer_id_edit != null){
			tx.executeSql('UPDATE offers set offer_name = "'+offer_name+'", offer_type = "'+offer_type+'",start_date = "'+start_date+'", end_date = "'+end_date+'", dis_by = "'+dis_by+'" ,amount = "'+amount+'",min_purchase = "'+min_purchase+'" where id = '+offer_id_edit+'', [], querySuccess, errorQuery);
		}else{
			tx.executeSql('INSERT INTO offers (id, offer_name, offer_type, start_date,end_date, dis_by, amount,min_purchase,applied_cat,status) VALUES (NULL,"'+offer_name+'","'+offer_type+'","'+start_date+'","'+end_date+'","'+dis_by+'","'+amount+'","'+min_purchase+'","'+applied_cat+'",1)', [], querySuccess, errorQuery);
			
		}
		//location.reload();
		function querySuccess(){
			window.location.href = "offer.html";
		}
		function errorQuery(){
			alert("Something went wrong!!");
		}
		});	
	}
	});		
});