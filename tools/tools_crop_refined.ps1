Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\Vitor Hugo\.gemini\antigravity\brain\0f3d965c-1196-494e-ad90-bd589c1a1325\.user_uploaded\media_1793498053654_7c7b49be.jpg"
$destDir = "E:\GDM_LIVE_RADIO\frontend\public\images"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Save-Crop($x, $y, $w, $h, $name) {
    if ($x + $w -gt $bmp.Width) { $w = $bmp.Width - $x }
    if ($y + $h -gt $bmp.Height) { $h = $bmp.Height - $y }
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outPath = "$destDir\$name"
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
    Write-Output "Saved $name ($x, $y, $w, $h)"
}

# Player bar album art (X: 25 to 75, Y: 340 to 395)
Save-Crop 25 342 50 50 "player-album-art.jpg"

# Refined Card 2 Glowing Bible (no text)
Save-Crop 560 500 138 124 "card-bible-glowing-clean.jpg"

# Refined Card 3 Neon Headphones (no text)
Save-Crop 885 500 101 124 "card-headphones-neon-clean.jpg"

# Full Card 2 (to see whole card background)
Save-Crop 370 488 330 142 "card-2-full.jpg"

# Full Card 3 (to see whole card background)
Save-Crop 710 488 280 142 "card-3-full.jpg"

# Logo top left
Save-Crop 20 12 220 54 "logo-gdm-clean.jpg"

$bmp.Dispose()
