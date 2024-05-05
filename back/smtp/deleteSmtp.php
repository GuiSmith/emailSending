<?php

    require "../conn.php";

    $data = json_decode(file_get_contents('php://input'),true);

    try {
        $sql = 'DELETE FROM smtp WHERE id = :id';
        $qry = $conn->prepare($sql);
        $qry->bindParam(':id',$data['id'],PDO::PARAM_INT);
        $qry->execute();

        if ($qry->rowCount() > 0) {
            $response['ok'] = true;
            $response['message'] = "SMTP deletado com sucesso!";
        }else{
            $response['ok'] = false;
            $response['message'] = "Nenhum registro deletado";
        }
        $response['rows'] = $qry->rowCount();
    } catch (PDOException $error) {
        $response['ok'] = false;
        if ($error->errorInfo[1]==1451) {
            $response['message'] = 'Há mensagens criadas com este SMTP';
        }else{
            $response['message'] = 'Algo deu errado com a query';
        }        
        $response['error'] = $error;
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>