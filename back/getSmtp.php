<?php

    require "conn.php";

    $data['id'] = $_GET['id'];

    try {
        if ($data['id'] > 0 && is_numeric($data['id'])) {
            $sql = 'SELECT id,smtp,sender,pass FROM smtp WHERE id = :id';
            $qry = $conn->prepare($sql);
            $qry->bindParam(':id',$data['id'],PDO::PARAM_INT);
            $qry->execute();
            if ($qry->rowCount() > 0) {
                $response['ok'] = true;
                $response['message'] = 'Dados de SMTP resgatados com sucesso';
                $response['obj'] = $qry->fetchAll(PDO::FETCH_OBJ)[0];    
            }else{
                $response['false'] = true;
                $response['message'] = 'SMTP não encontrado';
            }
            
        }else{
            $response['ok'] = false;
            $response['message'] = 'ID inválido';
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