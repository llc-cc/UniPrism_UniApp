# 在 GitHub 创建 UniPrism_UniApp 仓库并推送 main + feature/xiaochengxu
# 用法：在 PowerShell 中于项目根目录执行 .\scripts\create-and-push-github.ps1

$ErrorActionPreference = "Stop"
$Repo = "poet77/UniPrism_UniApp"
$Root = Split-Path $PSScriptRoot -Parent

function Resolve-GhCommand {
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
    [System.Environment]::GetEnvironmentVariable("Path", "User")

  $cmd = Get-Command gh -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $candidates = @(
    "C:\Program Files\GitHub CLI\gh.exe",
    "$env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
  )
  foreach ($path in $candidates) {
    if (Test-Path $path) { return $path }
  }

  throw "未找到 GitHub CLI。请运行: winget install GitHub.cli，然后重新打开 PowerShell。"
}

Set-Location $Root
Write-Host "Working directory: $Root"

$Gh = Resolve-GhCommand
Write-Host "Using GitHub CLI: $Gh"

& $Gh auth status 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
  Write-Host "请先登录 GitHub（浏览器授权一次即可）..."
  & $Gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { throw "GitHub 登录失败。" }
}

Write-Host "Creating repository $Repo (if not exists)..."
& $Gh repo view $Repo 2>$null
if ($LASTEXITCODE -ne 0) {
  & $Gh repo create $Repo --public --source=. --remote=origin --description "UniPrism WeChat mini-program (UniApp)"
  if ($LASTEXITCODE -ne 0) {
    & $Gh repo create $Repo --private --source=. --remote=origin --description "UniPrism WeChat mini-program (UniApp)"
  }
  if ($LASTEXITCODE -ne 0) { throw "创建 GitHub 仓库失败。" }
} else {
  git remote remove origin 2>$null
  git remote add origin "https://github.com/$Repo.git"
}

git checkout main
git push -u origin main
if ($LASTEXITCODE -ne 0) { throw "推送 main 失败。" }

git checkout feature/xiaochengxu
git push -u origin feature/xiaochengxu
if ($LASTEXITCODE -ne 0) { throw "推送 feature/xiaochengxu 失败。" }

Write-Host "Done: https://github.com/$Repo"
