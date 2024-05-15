<?php

    //Requires database connection
    require "../conn.php";

    //Gets data sent as POST
    $data = json_decode(file_get_contents('php://input'),true);

    try {
        $sql = 'UPDATE email SET smtp_id = :smtp_id,message_id = :message_id,subject = :subject, content = :content, address = :address WHERE id = :id';
        $qry = $conn->prepare($sql);
        $qry->bindParam(':smtp_id',$data['smtp_id'],PDO::PARAM_INT);
        $qry->bindParam(':message_id',$data['message_id'],PDO::PARAM_INT);
        $qry->bindParam(':subject',$data['subject'],PDO::PARAM_STR);
        $qry->bindParam(':content',$data['content'],PDO::PARAM_STR);
        $qry->bindParam(':address',$data['address'],PDO::PARAM_STR);
        $qry->bindParam(':id',$data['id'],PDO::PARAM_INT);
        $qry->execute();
        //Gets the ID of the smtp registered
        $select_sql = 'SELECT LAST_INSERT_ID()';
        $select_qry = $conn->prepare($select_sql);
        $select_qry->execute();
        $response['ok'] = true;
        $response['message'] = "E-mail atualizado com sucesso";
        $response['id'] = $select_qry->fetchAll(PDO::FETCH_OBJ)[0];
    } catch (PDOException $error) {
        //Handles wathever error happens and sents the error message
        $response['ok'] = false;
        $response['message'] = 'Algo deu errado com a edição' . $error->getMessage();
        $response['error'] = $error->getMessage();
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>