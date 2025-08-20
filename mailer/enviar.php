<?php
// Habilitar CORS si es necesario (útil para desarrollo local)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Autoload de Composer
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Validación básica del método
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["mensaje" => "Método no permitido"]);
    exit;
}

// Recoger datos y limpiar
$nombre  = htmlspecialchars($_POST['nombre'] ?? '');
$telefono = htmlspecialchars($_POST['telefono'] ?? '');
$correo  = htmlspecialchars($_POST['correo'] ?? '');
$tipo    = htmlspecialchars($_POST['tipo'] ?? '');
$fecha   = htmlspecialchars($_POST['fecha'] ?? '');

// Validación básica de campos
if (empty($nombre) || empty($telefono) || empty($correo) || empty($tipo) || empty($fecha)) {
    http_response_code(400);
    echo json_encode(["mensaje" => "Todos los campos son obligatorios"]);
    exit;
}

// Configurar PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->CharSet = 'UTF-8';
    $mail->Host       = 'smtp.hostinger.com'; // Cambia esto por el servidor SMTP que uses (ej. smtp.hostinger.com)
    $mail->SMTPAuth   = true;
    $mail->Username   = ''; // Cambia por tu correo
    $mail->Password   = '';           // Cambia por tu contraseña
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;


    // Emisor y receptor
    $mail->setFrom('', 'Registro Evento');
    $mail->addAddress(''); // destinatario: usuario registrado
    
    // Contenido
    $mail->isHTML(true);
    $mail->Subject = "Confirmación de Registro - Evento Amenidades";
    $mail->Body    = "
        <h2>Se ha creado un registro al evento con los siguientes datos:</h2>
        <p><strong>Nombre:</strong> {$nombre}</p>
        <p><strong>Teléfono:</strong> {$telefono}</p>
        <p><strong>Correo:</strong> {$correo}</p>
        <p><strong>Tipo:</strong> {$tipo}</p>
        <p><strong>Fecha del evento:</strong> {$fecha}</p>
    ";

    $mail->send();
    echo json_encode(["mensaje" => "Correo enviado exitosamente"]);
}  catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "mensaje" => "No se pudo enviar el correo. Error: " . $mail->ErrorInfo
    ]);
    error_log("PHPMailer error: " . $mail->ErrorInfo); // También lo logueamos para mayor detalle
}
