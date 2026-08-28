$ErrorActionPreference = "Stop"

$NodePath = "node"
if (Test-Path "C:\Program Files\nodejs\node.exe") {
    $NodePath = "C:\Program Files\nodejs\node.exe"
}

Write-Host "Démarrage du serveur de développement Next.js..."
& $NodePath ".\node_modules\next\dist\bin\next" dev