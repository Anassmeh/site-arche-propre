<?php

$dir = __DIR__ . '/config/jwt';

if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

$config = [
    "private_key_bits" => 2048,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
];

// Générer les clésa<?php

// Chemin du dossier où stocker les clés
$privateKeyPath = __DIR__ . '/config/jwt/private.pem';
$publicKeyPath = __DIR__ . '/config/jwt/public.pem';

// Crée le dossier s'il n'existe pas
if (!is_dir(__DIR__ . '/config/jwt')) {
    mkdir(__DIR__ . '/config/jwt', 0777, true);
}

// Génération de la clé privée
$privateKey = openssl_pkey_new([
    "private_key_bits" => 2048,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
]);

if ($privateKey === false) {
    die("❌ Erreur : Impossible de générer la clé privée.\n");
}

// Export de la clé privée dans une variable
if (!openssl_pkey_export($privateKey, $privateKeyString)) {
    die("❌ Erreur : Impossible d'exporter la clé privée.\n");
}

// Récupération de la clé publique
$keyDetails = openssl_pkey_get_details($privateKey);
$publicKeyString = $keyDetails['key'];

// Sauvegarde des clés
file_put_contents($privateKeyPath, $privateKeyString);
file_put_contents($publicKeyPath, $publicKeyString);

echo "🎉 Clés générées avec succès !\n";
echo "🔐 Private key : $privateKeyPath\n";
echo "🔓 Public key  : $publicKeyPath\n";

$res = openssl_pkey_new($config);

openssl_pkey_export($res, $privateKey);

$details = openssl_pkey_get_details($res);
$publicKey = $details["key"];

// Enregistrement
file_put_contents($dir . '/private.pem', $privateKey);
file_put_contents($dir . '/public.pem', $publicKey);

echo "✔️ Clés JWT générées dans config/jwt/\n";
