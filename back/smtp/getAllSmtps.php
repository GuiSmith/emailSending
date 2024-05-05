<?php

    require "../conn.php";

    try {
        $sql = 'SELECT id,smtp,sender FROM smtp';
        $qry = $conn->prepare($sql);
        $qry->execute();
        if ($qry->rowCount() > 0) {
            $response['ok'] = true;
            $response['message'] = 'Dados de SMTP resgatados com sucesso';
            $response['list'] = $qry->fetchAll(PDO::FETCH_OBJ);    
        }else{
            $response['false'] = true;
            $response['message'] = 'Não há SMTPs cadastrados';
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