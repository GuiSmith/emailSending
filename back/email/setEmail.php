<?php

    //Requires database connection
    require "../conn.php";

    //Gets data sent as POST
    $data = json_decode(file_get_contents('php://input'),true);

    try {
        $sql = 'INSERT INTO email (smtp_id,message_id,subject,content, address) values (:smtp_id,:message_id,:subject,:content, :address)';
        $qry = $conn->prepare($sql);
        $qry->bindParam(':smtp_id',$data['smtp_id'],PDO::PARAM_INT);
        $qry->bindParam(':message_id',$data['message_id'],PDO::PARAM_INT);
        $qry->bindParam(':subject',$data['subject'],PDO::PARAM_STR);
        $qry->bindParam(':content',$data['content'],PDO::PARAM_STR);
        $qry->bindParam(':address',$data['address'],PDO::PARAM_STR);
        $qry->execute();
        //Gets the ID of the email registered
        $select_sql = 'SELECT LAST_INSERT_ID()';
        $select_qry = $conn->prepare($select_sql);
        $select_qry->execute();
        $response['ok'] = true;
        $response['message'] = "E-mail cadastrado com sucesso";
        $response['id'] = $select_qry->fetchAll(PDO::FETCH_OBJ)[0];
    } catch (PDOException $error) {
        //Handles wathever error happens and sents the error message
        $response['ok'] = false;
        $response['message'] = 'Algo deu errado com a inserção';
        $response['error'] = $error->getMessage();
        $response['obj'] = $data;
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>