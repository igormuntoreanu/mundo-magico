<#
  Contact sheet for one country's dish candidates.

  Rows are dishes, columns are the downloaded candidates for that dish, so a
  whole country can be reviewed in one image before anything is published.

  Usage:
    pwsh -File scripts/dish-candidates-sheet.ps1 -Iso ar
    pwsh -File scripts/dish-candidates-sheet.ps1 -Iso ar -Out screenshots/sheet-ar.jpg

  Requires the candidates first:
    node scripts/fetch-dish-photos.mjs --candidates ar --count 3
#>
param(
  [Parameter(Mandatory = $true)][string]$Iso,
  [string]$Out = ""
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "screenshots\dish-candidates\$Iso"
if (-not (Test-Path $dir)) { throw "no candidates at $dir" }
if ([string]::IsNullOrWhiteSpace($Out)) { $Out = Join-Path $dir "sheet.jpg" }

$dishes = Get-ChildItem $dir -Directory | Sort-Object Name
if (-not $dishes) { throw "no dish folders in $dir" }

$cols = 3
$cw = 620; $ch = 440; $lh = 34; $rh = 26
$maxImgs = ($dishes | ForEach-Object { (Get-ChildItem $_.FullName -Filter *.jpg).Count } | Measure-Object -Maximum).Maximum
if ($maxImgs -lt 1) { throw "no candidate jpgs in $dir" }
$cols = [int][math]::Min([math]::Max([int]$maxImgs, 1), 4)

$width = [int]($cols * $cw)
$height = [int]($dishes.Count * ($lh + $rh + $ch) + 10)
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$dishFont = New-Object System.Drawing.Font('Segoe UI', 16, [System.Drawing.FontStyle]::Bold)
$cellFont = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Regular)
$rowFont = New-Object System.Drawing.Font('Segoe UI', 10, [System.Drawing.FontStyle]::Regular)

$y = 4
foreach ($dish in $dishes) {
  $g.DrawString($dish.Name, $dishFont, [System.Drawing.Brushes]::Black, 6, $y)
  $y += $lh

  $files = Get-ChildItem $dish.FullName -Filter *.jpg | Sort-Object Name
  $x = 0
  foreach ($f in $files) {
    $g.DrawString(("{0} #{1}" -f $dish.Name, [int]$f.BaseName), $cellFont, [System.Drawing.Brushes]::DimGray, $x + 4, $y)
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $scale = [math]::Min(($cw - 8) / $img.Width, ($ch - 8) / $img.Height)
    $dw = [int]($img.Width * $scale); $dh = [int]($img.Height * $scale)
    $g.DrawImage($img, $x + [int](($cw - $dw) / 2), $y + $rh + [int](($ch - $rh - $dh) / 2), $dw, $dh)
    $img.Dispose()
    $x += $cw
  }
  $y += $rh + $ch
}

$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bmp.Dispose()
Write-Output $Out

