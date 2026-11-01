Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\Vitor Hugo\.gemini\antigravity\brain\0f3d965c-1196-494e-ad90-bd589c1a1325\.user_uploaded\media_1793498053654_7c7b49be.jpg"
$destDir = "E:\GDM_LIVE_RADIO\frontend\public\images"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Source Dimensions: $($bmp.Width) x $($bmp.Height)"

function Save-Crop($x, $y, $w, $h, $name) {
    # Ensure within bounds
    if ($x + $w -gt $bmp.Width) { $w = $bmp.Width - $x }
    if ($y + $h -gt $bmp.Height) { $h = $bmp.Height - $y }
    
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $bmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outPath = "$destDir\$name"
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
    Write-Output "Saved $name ($x, $y, $w, $h)"
}

# 1. Hero Right Visual Art (Golden Play, Cross, Worshipper on Mountaintop, Sunset)
Save-Crop 380 72 644 266 "hero-art-hyperrealistic.jpg"

# 2. Hero Background Full Artwork (from start of space glow to right)
Save-Crop 0 70 1024 270 "hero-bg-hyperrealistic.jpg"

# 3. Holy Bible Glowing with Golden Divine Rays (Card 2)
# Card 2 is approximately from x=375, y=508 to x=698, y=624
# The glowing bible itself is on the right side of Card 2
Save-Crop 545 508 153 116 "card-bible-glowing.jpg"

# 4. 3D Neon Purple Studio Headphones (Card 3)
# Card 3 is from x=710, y=508 to x=986, y=624
# The neon purple headphones are on the right side of Card 3
Save-Crop 860 510 126 114 "card-headphones-neon.jpg"

# 5. GDM Logo from top left
Save-Crop 20 16 185 54 "gdm-brand-logo-hyperrealistic.jpg"

# 6. Playing Album Art (Square with GDM Cross on Cosmic Background)
Save-Crop 27 502 52 52 "gdm-album-art-default.jpg"

$bmp.Dispose()
Write-Output "Precise crop complete!"
