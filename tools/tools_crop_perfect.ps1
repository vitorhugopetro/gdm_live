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

# Bible without any text on left (X: 580, Y: 495, W: 118, H: 128)
Save-Crop 580 495 118 128 "card-bible-realistic.jpg"

# Headphones without any text on left (X: 896, Y: 495, W: 90, H: 128)
Save-Crop 896 495 90 128 "card-headphones-realistic.jpg"

# Golden calligraphic footer signoff: "Deus abençoe você!" (X: 760, Y: 628, W: 215, H: 45)
Save-Crop 760 628 215 45 "footer-blessing-gold.jpg"

$bmp.Dispose()
Write-Output "Perfected assets saved."
