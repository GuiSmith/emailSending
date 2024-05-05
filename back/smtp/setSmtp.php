<?php

    //Requires database connection
    require "../conn.php";

    //Gets data sent as POST
    $data = json_decode(file_get_contents('php://input'),true);

    try {
        //Tests if the sender e-mail is valid
        if (!filter_var($data['sender'],FILTER_VALIDATE_EMAIL)) {
            $response['ok'] = false;
            $response['message'] = 'E-mail de envio inválido: ' . $data['sender'];
        }else{
            //Selects an existent register
            $test_sql = 'SELECT * FROM smtp WHERE smtp = :smtp AND sender = :sender';
            $test_qry = $conn->prepare($test_sql);
            $test_qry->bindParam(':smtp',$data['smtp'],PDO::PARAM_STR);
            $test_qry->bindParam(':sender',$data['sender'],PDO::PARAM_STR);
            $test_qry->execute();
            //Checks if it's already registered
            if ($test_qry->rowCount() > 0) {
                $response['ok'] = false;
                $response['message'] = 'SMTP já cadastrado!';
                $response['obj'] = $test_qry->fetchAll(PDO::FETCH_OBJ)[0];
            }else{
                //If it's not already registered and e-mail is valid
                $sql = 'INSERT INTO smtp (smtp,password,sender) values (:smtp,:password,:sender)';
                $qry = $conn->prepare($sql);
                $qry->bindParam(':smtp',$data['smtp'],PDO::PARAM_STR);
                $qry->bindParam(':password',$data['password'],PDO::PARAM_STR);
                $qry->bindParam(':sender',$data['sender'],PDO::PARAM_STR);
                $qry->execute();
                //Gets the ID of the smtp registered
                $select_sql = 'SELECT LAST_INSERT_ID()';
                $select_qry = $conn->prepare($select_sql);
                $select_qry->execute();
                $response['ok'] = true;
                $response['message'] = "SMTP cadastrado com sucesso";
                $response['id'] = $select_qry->fetchAll(PDO::FETCH_OBJ)[0];
            }
        }
    } catch (PDOException $error) {
        //Handles wathever error happens and sents the error message
        $response['ok'] = false;
        $response['message'] = 'Algo deu errado com a inserção';
        $response['error'] = $error->getMessage();
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>