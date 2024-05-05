<?php

    require "../conn.php";

    try {
        $sql = 'SELECT id as ID,name as Nome,smtp_id as SMTP,subject as Assunto,SUBSTRING(content,1,30) as Conteúdo FROM message';
        $qry = $conn->prepare($sql);
        $qry->execute();
        if ($qry->rowCount() > 0) {
            $response['ok'] = true;
            $response['message'] = 'Dados de mensagens resgatados com sucesso';
            $response['list'] = $qry->fetchAll(PDO::FETCH_OBJ);    
        }else{
            $response['false'] = true;
            $response['message'] = 'Não há mensagens cadastrados';
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