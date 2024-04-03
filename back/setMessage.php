<?php

    //Requires database connection
    require "conn.php";

    //Gets data sent as POST
    $data = json_decode(file_get_contents('php://input'),true);

    try {
        $sql = 'INSERT INTO message (name,smtp_id,subject,content) values (:name,:smtp_id,:subject,:content)';
        $qry = $conn->prepare($sql);
        $qry->bindParam(':name',$data['name'],PDO::PARAM_STR);
        $qry->bindParam(':smtp_id',$data['smtp_id'],PDO::PARAM_INT);
        $qry->bindParam(':subject',$data['subject'],PDO::PARAM_STR);
        $qry->bindParam(':content',$data['content'],PDO::PARAM_STR);
        $qry->execute();
        //Gets the ID of the smtp registered
        $select_sql = 'SELECT LAST_INSERT_ID()';
        $select_qry = $conn->prepare($select_sql);
        $select_qry->execute();
        $response['ok'] = true;
        $response['message'] = "Mensagem cadastrada com sucesso";
        $response['id'] = $select_qry->fetchAll(PDO::FETCH_OBJ)[0];
    } catch (PDOException $error) {
        //Handles wathever error happens and sents the error message
        $response['ok'] = false;
        $response['message'] = 'Algo deu errado com a inserção';
        $response['error'] = $error->getMessage();
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>