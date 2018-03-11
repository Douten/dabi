<?php
include("connect-info.php");
// Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT info FROM dabi WHERE user='apikeys'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo $row["info"];
        }
    } else {
        echo "0 results";
    }
    $conn->close();


?>