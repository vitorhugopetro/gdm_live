Add-Type -AssemblyName System.Drawing
$srcPath = "C:\Users\Vitor Hugo\.gemini\antigravity\brain\0f3d965c-1196-494e-ad90-bd589c1a1325\.user_uploaded\media_1793498053654_7c7b49be.jpg"
$destDir = "E:\GDM_LIVE_RADIO\frontend\public\images"

if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

# Copy the entire master reference image
Copy-Item $srcPath "$destDir\gdm-master-mockup.jpg" -Force

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Master image size: $($bmp.Width) x $($bmp.Height)"

# Function to crop and save
function Crop-Image($x, $y, $w, $h, $outputName) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $outPath = "$destDir\$outputName"
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $cropped.Dispose()
    Write-Output "Saved: $outputName ($w x $h)"
}

# Let's inspect the layout of media_1793498053654_7c7b49be.jpg (1024 x 682)
# Typically:
# Top/Hero section is in the upper half
# Bottom cards are in the lower half
# Let's save a few slices to explore:
# 1. Full Hero / Banner Artwork (Right or Central side of hero)
# Upper right quadrant is usually the emblem + worshipper + cross
Crop-Image 400 30 600 320 "hero-artwork-realistic.jpg"

# 2. Lower cards:
# Card 2 (Bible with golden rays) ~ bottom middle/left
Crop-Image 340 370 340 270 "card-bible-realistic.jpg"

# 3. Card 3 (Headphones neon violet) ~ bottom right
Crop-Image 680 370 330 270 "card-headphones-realistic.jpg"

# 4. Master Banner (entire upper half)
Crop-Image 0 0 1024 350 "hero-banner-full.jpg"

$bmp.Dispose()
Write-Output "Image processing complete."
