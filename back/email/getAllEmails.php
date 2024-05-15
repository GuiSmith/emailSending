<?php

    require "../conn.php";

    try {
        $sql = 'SELECT * FROM email';
        $qry = $conn->prepare($sql);
        $qry->execute();
        if ($qry->rowCount() > 0) {
            $response['ok'] = true;
            $response['message'] = 'Dados de emails resgatados com sucesso';
            $response['list'] = $qry->fetchAll(PDO::FETCH_OBJ);    
        }else{
            $response['ok'] = false;
            $response['message'] = 'Não há emails cadastrados';
        }
    } catch (PDOException $error) {
        $response['ok'] = false;
        $response['message'] = 'Algo deu errado com a pesquisa';
        // $response['error'] = $error->getMessage();
        $response['error'] = $error->getMessage();
    }

    header('ContentType: application/json');
    echo json_encode($response);

?>