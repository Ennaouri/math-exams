$ErrorActionPreference = "Stop"

$NodeExe = Join-Path $PSScriptRoot "node20.exe"
$NpmCli = Join-Path $PSScriptRoot "node_modules\npm\bin\npm-cli.js"

if (-not (Test-Path $NodeExe)) {
    Write-Host "Downloading Node.js 20..."
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.18.1/win-x64/node.exe" -OutFile $NodeExe
}

Write-Host "Starting dev server with Node.js $((& $NodeExe --version))..."
& $NodeExe $NpmCli run dev