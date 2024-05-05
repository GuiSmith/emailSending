<?php

    $conn = new PDO('mysql:host=localhost;dbname=emailsending;charset=utf8','root','');

    $response = array(
        "ok" => '',
        "message" => ''
    );

    function getFromUrl($key){
        return (isset($_GET[$key])) ? ($_GET[$key]) : ('');
    }

?>