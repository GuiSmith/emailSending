<?php

    require "../conn.php";

    $data = json_decode(file_get_contents('php://input'),true);

    try {
        //Tests if the sender e-mail is valid
        if (!filter_var($data['sender'],FILTER_VALIDATE_EMAIL)) {
            $response['ok'] = false;
            $response['message'] = 'E-mail inválido';
        }else{
            //Selects an existent smtp
            $test_sql = 'SELECT * FROM smtp WHERE smtp = :smtp AND sender = :sender';
            $test_qry = $conn->prepare($test_sql);
            $test_qry->bindParam(':smtp',$data['smtp'],PDO::PARAM_STR);
            $test_qry->bindParam(':sender',$data['sender'],PDO::PARAM_STR);
            $test_qry->execute();
            $test_rows = $test_qry->rowCount();
            $existent_smtp = ($test_rows>0) ? ($test_qry->fetchAll(PDO::FETCH_OBJ)[0]) : ('');
            //Checks if there's an existent smtp
            if ($test_rows > 0 && $existent_smtp->id != $data['id']) {
                $response['ok'] = false;
                $response['message'] = 'SMTP já existente';
                // $response['obj'] = $existent_smtp;
            }else{
                //If e-mail is valid and smtp is not already registered
                $sql = 'UPDATE smtp SET smtp = :smtp, password = :password,sender = :sender WHERE id = :id';
                $qry = $conn->prepare($sql);
                $qry->bindParam(':smtp',$data['smtp'],PDO::PARAM_STR);
                $qry->bindParam(':password',$data['password'],PDO::PARAM_STR);
                $qry->bindParam(':sender',$data['sender'],PDO::PARAM_STR);
                $qry->bindParam(':id',$data['id'],PDO::PARAM_INT);
                $qry->execute();
                $response['ok'] = true;
                $response['message'] = "SMTP atualizado com sucesso";
            }
        }
    } catch (PDOException $error) {
        //Handles wathever errors happen and sends the error message
        $response['ok'] = false;
        $response['message'] = 'Algo deu errado com a edição';
        $response['error'] = $error->getMessage();
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>