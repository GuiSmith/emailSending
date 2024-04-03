<?php

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	require 'PHPMailer/src/Exception.php';
	require 'PHPMailer/src/PHPMailer.php';
	require 'PHPMailer/src/SMTP.php';

	require "conn.php";

	$data = json_decode(file_get_contents('php://input'), true);

	try {

		// Data
		$smtp = $data['smtp'];
		$password = $data['password'];
		$sender = $data['sender'];
		$subject = $data['subject'];
		$content = $data['content'];

		// PHPMailer Obj and configs
		$mail = new PHPMailer(true);
		$mail->isSMTP();
		$mail->Host = $smtp;
		$mail->SMTPAuth = true;
		$mail->Username = $sender;
		$mail->Password = $password;
		$mail->Port = 465;
		$mail->SMTPSecure = 'ssl';
		$mail->isHTML (true);
		$mail->setFrom($sender, $name);
		$mail->addAddress($email);
		$mail->Subject = ("$subject");
		$mail->Body = $content;
		$mail->send();
	} catch (\Throwable $th) {
		//throw $th;
	}

	if (isset($_POST["submit"])) {
		
		$name = $_POST["name"];
		$email = $_POST["email"];
		$subject = $_POST["subject"];
		$content = $_POST["content"];

		

		echo "Worked!";

	}

?>

