<?php
$fileArray = $_FILES;
$img_type = $_GET['type'];
$www_root = $_SERVER["DOCUMENT_ROOT"]."/file_upload/";
//$user_id = $_GET['id'];
$arr_name = array();
if(is_array($fileArray) && count($fileArray)){
				$upload_flag = 0;
				foreach($fileArray as $filename){
				$size = $filename['size'];
				$sizeinkb = $size/1024;				
				$name = $filename['name'];
				$tmp_name = $filename['tmp_name'];
				$type = $filename['type'];
				$message = "success";
				$image = strtolower($name);
				$extname = substr(strrchr($image, "."), 1);
				if($img_type == 1){
					$path = $www_root."images/Categories/";
				}elseif($img_type == 2){
					$path = $www_root.'images/Brands/';
				}else{
					$path = $www_root.'images/Products/';
				}
				if(!is_dir($path)){
					mkdir($path);
				}				
				$uniqname = md5(uniqid(rand(),true));
				$filename = $uniqname.".".$extname;
				$targetpath = $path.$filename;
				
				list($width,$height) = getimagesize($tmp_name);
				if($width > 200){
					try{
						if($extname == "png"){
							$src = imagecreatefrompng($tmp_name);
						}
						elseif($extname == "gif"){
							$src = imagecreatefromgif($tmp_name);
						}
						elseif($extname == "bmp"){
							$src = imagecreatefromwbmp($tmp_name);
						}
						else{
							$src = imagecreatefromjpeg($tmp_name);
						}						
						$newwidth = 200;
						$newheight = ($height/$width)*$newwidth;
						//$newheight = 600;
						$tmp = imagecreatetruecolor($newwidth,$newheight);
		
						imagecopyresampled($tmp,$src,0,0,0,0,$newwidth,$newheight,$width,$height);
						if(imagejpeg($tmp,$targetpath,100)){
							$upload_flag = 1;	
						}
						imagedestroy($src);
						imagedestroy($tmp);
					}
					catch(Exception $e){
						return false;
					}
				}
				else{				
					if(move_uploaded_file($tmp_name,$targetpath)){
						$upload_flag = 1;	
					}
				}
				if($upload_flag == 1){
					
					array_push($arr_name,$filename);
				}
	
		}
		print_r($arr_name[0]);
	}
	
	?>