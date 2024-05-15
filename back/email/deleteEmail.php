<?php

    require "../conn.php";

    $data = json_decode(file_get_contents('php://input'),true);

    try {
        $sql = 'DELETE FROM email WHERE id = :id';
        $qry = $conn->prepare($sql);
        $qry->bindParam(':id',$data['id'],PDO::PARAM_INT);
        $qry->execute();
        $response['ok'] = true;
        $response['message'] = "Mensagem deletada com sucesso!";
    } catch (PDOException $error) {
        $response['ok'] = false;
        if ($error->errorInfo[1]==1451) {
            $response['message'] = 'Há registros criados com esta mensagem';
        }else{
            $response['message'] = 'Algo deu errado com a deleção';
        }
        $response['error'] = $error;
    }

    header('Content-Type:application/json');
    echo json_encode($response);

?>