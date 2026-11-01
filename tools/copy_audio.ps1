$audioDir = "E:\GDM_LIVE_RADIO\frontend\public\audio"
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

$filesToCopy = @(
    @{ Src = "A Cruz e o Sacrifcio de Jesus v1.mp3"; Dst = "a-cruz-e-o-sacrificio.mp3" },
    @{ Src = "A Dana dos Redimidos v1.mp3"; Dst = "a-danca-dos-redimidos.mp3" },
    @{ Src = "A Luz Que Veio ao Mundo Joo 3_14-21 musica 1.mp3"; Dst = "a-luz-que-veio-ao-mundo.mp3" },
    @{ Src = "A Glria da ltima Casa v1.mp3"; Dst = "a-gloria-da-ultima-casa.mp3" },
    @{ Src = "A Rocha Mais Alta v1.mp3"; Dst = "a-rocha-mais-alta.mp3" }
)

foreach ($item in $filesToCopy) {
    # Match using wildcard to avoid codepage issues with accents
    $pattern = $item.Src.Substring(0, 10) + "*"
    $matched = Get-ChildItem -Path "E:\GDM_LIVE_RADIO\Minhas_Musicas" -Filter $pattern | Select-Object -First 1
    if ($matched) {
        $destFile = Join-Path $audioDir $item.Dst
        Copy-Item $matched.FullName $destFile -Force
        Write-Output "Copied: $($matched.Name) -> $($item.Dst) ($($matched.Length) bytes)"
    } else {
        Write-Warning "Could not find file matching: $pattern"
    }
}

Get-ChildItem -Path $audioDir | Select-Object Name, Length
