<?php

    $conn = new PDO('mysql:host=localhost;dbname=emailsender;charset=utf8','root','buggy1081');

    $response = array(
        "ok" => '',
        "message" => ''
    );

    function getFromUrl($key){
        return (isset($_GET[$key])) ? ($_GET[$key]) : ('');
    }

?>