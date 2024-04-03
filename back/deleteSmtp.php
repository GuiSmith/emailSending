<?php

    require "conn.php";

    $data = json_decode(file_get_contents('php://input'),true);

    try {
        $sql = 'DELETE FROM smtp WHERE id = :id';
        $qry = $conn->prepare($sql);
        $qry->bindParam(':id',$data['id'],PDO::PARAM_INT);
        $qry->execute();
        
        $response['ok'] = true;
        $response['message'] = "SMTP deletado com sucesso!";
    } catch (PDOException $error) {
        $response['ok'] = false;
        $response['message'] = 'Algo deu errado com a inserção';
        $response['error'] = $error->getMessage();
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>