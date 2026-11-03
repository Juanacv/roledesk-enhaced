<?php
$CHARACTERS_DIR = "images/character";
$BACKGROUNDS_DIR = "images/background";
$TEMPLATES_DIR = "templates";

function getFiles($directory) {
	$tmp_files = scandir($directory);
	$files = array();
	$allowed = array("jpg", "png", "jpeg", "gif", "svg");

	foreach ($tmp_files as $file) {
		if ($file !== "." && $file !== "..") {
			$imageFileType = strtolower(pathinfo($file, PATHINFO_EXTENSION));
			if (in_array($imageFileType, $allowed)) {
				$files[] = $file; 
			}
		}
	}
	echo json_encode($files);
}

function sendError($message) {
	header('HTTP/1.1 500 Internal Server Error');
	header('Content-Type: application/json; charset=UTF-8');
	die($message);
}

function setFile($directory, $input) {
	$base_name = basename($_FILES[$input]["name"]);
	$target_file = $directory.DIRECTORY_SEPARATOR.$base_name;
	$source_file = $_FILES[$input]["tmp_name"];
	$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
	$check = getimagesize($source_file);
	if ($check !== false) {
		$sizeinpixels = false;
		if ($input === "back") {
			if ($check[0] <= 1250 && $check[1] <= 975) {
				$sizeinpixels = true;
			}
		}
		else if ($input === "charac") {
			if ($check[0] <= 60 && $check[1] <= 92) {
				$sizeinpixels = true;
			}
		}
		if (!$sizeinpixels) {
			sendError(json_encode(array('message' => 'El tamaño de la imagen debe ser 1250x975 para fondos y 60x92 para personajes como máximos')));
		}
		else {
			if (in_array($imageFileType, array("jpg", "png", "jpeg", "gif"))) {
				if ($_FILES[$input]["size"] <= 6000000) {
					$j = 0;
					$file_info = pathinfo($base_name);
					while (file_exists($target_file)) {
						$base_name = $file_info['filename']."-".$j.".".$file_info['extension'];
						$target_file = $directory.DIRECTORY_SEPARATOR.$base_name;
						$j++;
					}
					if (move_uploaded_file($source_file ,$target_file)) {
						header('Content-Type: application/json');
       			 		print json_encode(array('message' => $base_name));
       			 	}
       			 	else {
       			 		sendError('Error copiando el archivo en el servidor');
       			 	}
				}
				else {
					sendError('El tamaño del archivo debe ser menor a 6 mb');
				}
			}
			else {
				sendError('Las extensiones admitidas son jpg, png, jpeg y gif');
			}
		}
	}
	else {
		sendError('El archivo no es del tipo imagen');
	}
}

function saveTemplate($svg, $name, $directory) {
	$svg = str_replace('&quot;', '\'', $svg);   
	$file_path = $directory.DIRECTORY_SEPARATOR.$name.'.svg';
	$exists = file_exists($file_path);
	if ($exists) {
		unlink($file_path);
	}
    if (file_put_contents($file_path, $svg)) {
    	header('Content-Type: application/json');
    	print json_encode(array('message' => $exists ? '' : $name.'.svg'));
    }
    else {
    	sendError('La plantilla no se ha podido salvar');
    }
}

if ($_POST['id'] == "CHARACTER") {
	getFiles($CHARACTERS_DIR);
}
else if ($_POST['id'] == "BACKGROUND") {
	getFiles($BACKGROUNDS_DIR);
}
else if ($_POST['id'] == "GETTEMPLATE") {
	getFiles($TEMPLATES_DIR);
}
else if ($_POST['id'] == "SAVEBACKGROUND") {
	setFile($BACKGROUNDS_DIR,"back");
}
else if ($_POST['id'] == "SAVECHARACTER") {
	setFile($CHARACTERS_DIR,"charac");
}
else if ($_POST['id'] == "SAVETEMPLATE") {
	saveTemplate($_POST['svg'],$_POST['name'],$TEMPLATES_DIR);
}
?>