<#
  chiffrer-coffres.ps1 - Chiffre les contenus confidentiels du portfolio.

  Les versions en clair restent sur ton ordinateur, dans le dossier prive/
  (exclu de git) :
    - prive/coffres/<id>.html : un bloc HTML par coffre ;
    - prive/docs/<fichier>    : les documents (PDF) à protéger.

  Le script demande un mot de passe, puis :
    - remplit l'attribut data-payload de chaque <div class="vault" data-vault="<id>">
      des pages HTML avec la version chiffrée de prive/coffres/<id>.html ;
    - écrit assets/docs/<fichier>.enc pour chaque document de prive/docs/.

  Chiffrement : PBKDF2-HMAC-SHA256 (600 000 itérations, sel aléatoire) pour
  dériver 64 octets ; AES-256-CBC pour le chiffrement, HMAC-SHA256 pour
  l'intégrité (encrypt-then-MAC). Le déchiffrement se fait dans le navigateur
  avec l'API WebCrypto (voir assets/js/fx.js, section « Coffres »).

  Utilisation (dans un terminal, à la racine du portfolio) :
    powershell -ExecutionPolicy Bypass -File outils\chiffrer-coffres.ps1

  À relancer après chaque modification d'un fichier de prive/, ou pour
  changer de mot de passe.
#>
param(
  # Réservé aux tests automatisés : lit le mot de passe dans $env:COFFRE_MDP_TEST.
  [switch]$Test
)

$ErrorActionPreference = 'Stop'
$racine = Split-Path -Parent $PSScriptRoot
$prive  = Join-Path $racine 'prive'
$utf8   = New-Object Text.UTF8Encoding($false)
$ITERATIONS = 600000

function En-Clair([Security.SecureString]$s) {
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

# --- 1. Mot de passe -------------------------------------------------------
if ($Test) {
  if (-not $env:COFFRE_MDP_TEST) { throw 'Mode test : définir $env:COFFRE_MDP_TEST.' }
  $mdp = $env:COFFRE_MDP_TEST
} else {
  Write-Host ''
  Write-Host 'Chiffrement des coffres du portfolio' -ForegroundColor Cyan
  Write-Host 'Choisis un mot de passe long (12 caractères minimum, idéalement une phrase).'
  Write-Host 'Il ne sera ni affiché ni enregistré nulle part.'
  Write-Host ''
  $m1 = En-Clair (Read-Host 'Mot de passe' -AsSecureString)
  $m2 = En-Clair (Read-Host 'Confirmation' -AsSecureString)
  if ($m1 -ne $m2) { throw 'Les deux saisies ne correspondent pas. Rien n''a été modifié.' }
  if ($m1.Length -lt 12) { throw 'Mot de passe trop court (12 caractères minimum). Rien n''a été modifié.' }
  $mdp = $m1
}

# --- 2. Dérivation des clés (un seul sel pour tout le site) ------------------
Write-Host 'Dérivation de la clé (quelques secondes)...'
$rng  = [Security.Cryptography.RandomNumberGenerator]::Create()
$sel  = New-Object byte[] 16
$rng.GetBytes($sel)
$kdf  = New-Object Security.Cryptography.Rfc2898DeriveBytes($mdp, $sel, $ITERATIONS, [Security.Cryptography.HashAlgorithmName]::SHA256)
$cles = $kdf.GetBytes(64)
$kdf.Dispose()
$mdp = $null; $m1 = $null; $m2 = $null
$cleChiffrement = [byte[]]$cles[0..31]
$cleIntegrite   = [byte[]]$cles[32..63]
$selB64 = [Convert]::ToBase64String($sel)

function Proteger([byte[]]$donnees) {
  $aes = [Security.Cryptography.Aes]::Create()
  $aes.KeySize = 256
  $aes.Mode    = [Security.Cryptography.CipherMode]::CBC
  $aes.Padding = [Security.Cryptography.PaddingMode]::PKCS7
  $aes.Key     = $cleChiffrement
  $aes.GenerateIV()
  $chiffre = $aes.CreateEncryptor().TransformFinalBlock($donnees, 0, $donnees.Length)
  $hmac = [Security.Cryptography.HMACSHA256]::new($cleIntegrite)
  $mac  = $hmac.ComputeHash([byte[]]($aes.IV + $chiffre))
  $iv   = $aes.IV
  $aes.Dispose(); $hmac.Dispose()
  # Format : v1.<itérations>.<sel>.<iv>.<chiffré>.<mac> (base64)
  return 'v1.{0}.{1}.{2}.{3}.{4}' -f $ITERATIONS, $selB64,
    [Convert]::ToBase64String($iv), [Convert]::ToBase64String($chiffre), [Convert]::ToBase64String($mac)
}

# --- 3. Coffres dans les pages HTML --------------------------------------
$motif = '(<div class="vault"[^>]*?data-vault="([a-z0-9-]+)"[^>]*?data-payload=")[^"]*(")'
$total = 0
Get-ChildItem -Path $racine -Filter '*.html' | ForEach-Object {
  $page  = $_.FullName
  $html  = [IO.File]::ReadAllText($page, $utf8)
  $avant = $html
  $html = [regex]::Replace($html, $motif, {
    param($m)
    $id = $m.Groups[2].Value
    $source = Join-Path $prive "coffres\$id.html"
    if (-not (Test-Path $source)) { throw "Fichier manquant pour le coffre « $id » : $source" }
    $script:total++
    $m.Groups[1].Value + (Proteger ([IO.File]::ReadAllBytes($source))) + $m.Groups[3].Value
  })
  if ($html -ne $avant) {
    [IO.File]::WriteAllText($page, $html, $utf8)
    Write-Host ('  {0}' -f $_.Name)
  }
}
Write-Host "$total coffre(s) chiffré(s) dans les pages."

# --- 4. Documents ----------------------------------------------------------
$docs = Join-Path $prive 'docs'
if (Test-Path $docs) {
  Get-ChildItem -Path $docs -File | ForEach-Object {
    $cible = Join-Path $racine ("assets\docs\{0}.enc" -f $_.Name)
    [IO.File]::WriteAllText($cible, (Proteger ([IO.File]::ReadAllBytes($_.FullName))), $utf8)
    Write-Host ('  document chiffré : assets/docs/{0}.enc' -f $_.Name)
  }
}

[Array]::Clear($cles, 0, $cles.Length)
Write-Host 'Terminé.' -ForegroundColor Green
