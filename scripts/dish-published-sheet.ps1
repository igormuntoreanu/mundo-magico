<#
  Contact sheet of already-published dish photos (public/dishes/<iso>/...),
  for reviewing a wave after it has been applied.

  Usage:
    pwsh -File scripts/dish-published-sheet.ps1 -Isos "pt,es,fr,it" -Out screenshots/europe-review-1.jpg
#>
param(
  [Parameter(Mandatory = $true)][string]$Isos,
  [string]$Out = ""
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$isoList = $Isos.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
$files = @()
foreach ($iso in $isoList) {
  $dir = Join-Path $root "public\dishes\$iso"
  if (-not (Test-Path $dir)) { continue }
  foreach ($f in (Get-ChildItem $dir -Filter *.jpg | Sort-Object Name)) {
    $files += [pscustomobject]@{ Iso = $iso; Slug = $f.BaseName; Path = $f.FullName }
  }
}
if (-not $files) { throw "no published photos for $Isos" }
if ([string]::IsNullOrWhiteSpace($Out)) { $Out = Join-Path $root "screenshots\published-review.jpg" }

$cols = 4
$cw = 420; $ch = 320; $lh = 22
$rows = [math]::Ceiling($files.Count / $cols)
$bmp = New-Object System.Drawing.Bitmap ([int]($cols * $cw)), ([int]($rows * ($ch + $lh) + 8))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font('Segoe UI', 11, [System.Drawing.FontStyle]::Bold)

$i = 0
foreach ($item in $files) {
  $x = ($i % $cols) * $cw
  $y = [math]::Floor($i / $cols) * ($ch + $lh)
  $g.DrawString(("{0}/{1}" -f $item.Iso, $item.Slug), $font, [System.Drawing.Brushes]::Black, $x + 4, $y + 2)
  $img = [System.Drawing.Image]::FromFile($item.Path)
  $scale = [math]::Min(($cw - 6) / $img.Width, ($ch - 6) / $img.Height)
  $dw = [int]($img.Width * $scale); $dh = [int]($img.Height * $scale)
  $g.DrawImage($img, $x + [int](($cw - $dw) / 2), $y + $lh + [int](($ch - $dh) / 2), $dw, $dh)
  $img.Dispose()
  $i++
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Out) | Out-Null
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose(); $bmp.Dispose()
Write-Output "$Out ($($files.Count) photos)"
