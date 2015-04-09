if(localStorage.getItem("login") != 'true') {
	window.location.href = 'index.html';
}
$(document).ready(function(){
$( "#tabs" ).tabs();
	var i = 0;
	var j=0;
	var maxQueueSize = 5;
	var queueSize = 0;
	var settings = {
	url: 'image_upload.php?type=1',
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
$("#img_product").uploadFile(settings);	
});