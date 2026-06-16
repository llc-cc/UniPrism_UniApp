# 清理卡住的微信开发者工具进程，便于重新导入项目。
# 用法: powershell -ExecutionPolicy Bypass -File scripts/reset-weixin-devtools.ps1

Write-Host "Stopping WeChat DevTools processes..."
Get-Process -Name "wechatdevtools" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

$remaining = @(Get-Process -Name "wechatdevtools" -ErrorAction SilentlyContinue)
if ($remaining.Count -gt 0) {
  Write-Host "Some WeChat DevTools processes are still running. Close them manually from Task Manager."
} else {
  Write-Host "WeChat DevTools processes cleared."
}

$dist = Join-Path $PSScriptRoot "..\unpackage\dist\dev\mp-weixin"
$dist = [System.IO.Path]::GetFullPath($dist)
Write-Host ""
Write-Host "Import this folder in WeChat DevTools:"
Write-Host $dist
Write-Host ""
Write-Host "Then: Settings -> Local Settings -> check 'Do not verify合法域名...'"
