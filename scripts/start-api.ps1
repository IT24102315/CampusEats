param([switch]$Migrate)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path $PSScriptRoot -Parent
$configPath = Join-Path $repoRoot 'backend.local'
if (!(Test-Path -LiteralPath $configPath)) { throw 'Copy backend.example.json to backend.local and fill in your PostgreSQL connection string.' }
$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
if (!$config.ConnectionStrings__Default) { throw 'Set ConnectionStrings__Default in backend.local.' }
foreach ($property in $config.PSObject.Properties) {
 [Environment]::SetEnvironmentVariable($property.Name, [string]$property.Value, 'Process')
}
if (!$env:Jwt__Key) {
 $bytes = New-Object byte[] 32
 $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
 $rng.GetBytes($bytes)
 $rng.Dispose()
 $env:Jwt__Key = [Convert]::ToBase64String($bytes)
}
Push-Location $repoRoot
try {
 if ($Migrate) {
  dotnet run --no-launch-profile --project backend/CampusEats.Api -- --migrate
 } else {
  dotnet run --no-launch-profile --project backend/CampusEats.Api
 }
 if ($LASTEXITCODE -ne 0) { throw 'API command failed. Review the preceding error.' }
} finally { Pop-Location }
