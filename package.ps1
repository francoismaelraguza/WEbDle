# Crea el ZIP para subir a la Chrome Web Store con solo los archivos que necesita la extensión.
# Uso: powershell -ExecutionPolicy Bypass -File package.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = $PSScriptRoot
$version = (Get-Content (Join-Path $root 'manifest.json') -Raw | ConvertFrom-Json).version
$files = @(
  'manifest.json',
  'background.js',
  'content.js',
  'icons/icon16.png',
  'icons/icon48.png',
  'icons/icon128.png'
)

$dist = Join-Path $root 'dist'
New-Item -ItemType Directory -Force $dist | Out-Null
$zipPath = Join-Path $dist "WEbDle-v$version.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Confirm:$false }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
try {
  foreach ($f in $files) {
    $src = Join-Path $root $f
    if (-not (Test-Path $src)) { throw "Falta el archivo: $f" }
    # Rutas con "/" para que Chrome las lea bien.
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $src, $f, 'Optimal') | Out-Null
  }
} finally {
  $zip.Dispose()
}

$size = [math]::Round((Get-Item $zipPath).Length / 1KB, 1)
Write-Output "Paquete creado: $zipPath ($size KB)"
