<?php 

require_once '../constant/db.php';

$sql = "SELECT connection_id, message_id, (SELECT msg.message_text FROM msg.message_type FROM message msg), to_name, thank_to_email, msg_type, time FROM connections WHERE email_sent = 1 LIMIT 5";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();

?>

