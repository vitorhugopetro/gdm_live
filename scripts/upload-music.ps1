# Upload de Músicas para Google Cloud Storage
# Execute este script no Windows PowerShell para enviar sua biblioteca
# para o Cloud Storage, onde o servidor de streaming irá acessá-las.
#
# Pré-requisitos:
# 1. gcloud CLI instalado (https://cloud.google.com/sdk/docs/install)
# 2. Autenticado: gcloud auth login
# 3. Projeto configurado: gcloud config set project gdm-live-radio

param(
    [string]$MusicPath = "E:\GDM_LIVE_RADIO\Minhas_Musicas",
    [string]$BucketName = "gdm-live-radio-music",
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " GDM Live Radio — Upload de Músicas" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se a pasta existe
if (-not (Test-Path $MusicPath)) {
    Write-Error "Pasta de músicas não encontrada: $MusicPath"
    exit 1
}

# Contar arquivos
$audioExtensions = @("*.mp3", "*.flac", "*.wav", "*.ogg", "*.m4a", "*.aac")
$files = @()
foreach ($ext in $audioExtensions) {
    $files += Get-ChildItem -Path $MusicPath -Filter $ext -File
}

Write-Host "Músicas encontradas: $($files.Count)" -ForegroundColor Green
Write-Host "Destino: gs://$BucketName/music/" -ForegroundColor Yellow
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN] Nenhum arquivo será enviado." -ForegroundColor Yellow
    Write-Host "Arquivos que seriam enviados:"
    $files | ForEach-Object { Write-Host "  - $($_.Name)" }
    exit 0
}

# Confirmar
$confirm = Read-Host "Confirmar upload de $($files.Count) arquivos? (s/N)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "Operação cancelada." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Iniciando upload..." -ForegroundColor Cyan

# Verificar se bucket existe, criar se não existir
$bucketExists = gcloud storage buckets describe gs://$BucketName 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Criando bucket: gs://$BucketName" -ForegroundColor Yellow
    gcloud storage buckets create gs://$BucketName `
        --project=gdm-live-radio `
        --location=us-central1 `
        --uniform-bucket-level-access
}

# Upload usando gsutil com paralelismo
Write-Host "Enviando arquivos (isso pode levar alguns minutos)..." -ForegroundColor Cyan

# Usar rsync para envio incremental (não reenvia o que já está lá)
gsutil -m rsync -r -x ".*" "$MusicPath" "gs://$BucketName/music/"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host " Upload concluído com sucesso!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Acesse o painel administrativo da rádio"
    Write-Host "2. Clique em 'Sincronizar Biblioteca'"
    Write-Host "3. Aguarde a indexação das músicas"
} else {
    Write-Error "Erro durante o upload. Verifique os logs acima."
}

