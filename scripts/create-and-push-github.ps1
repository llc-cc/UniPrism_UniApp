# 在 GitHub 创建 UniPrism_UniApp 仓库并推送 main + feature/xiaochengxu
# 用法：在 PowerShell 中于项目根目录执行 .\scripts\create-and-push-github.ps1

$ErrorActionPreference = "Stop"
$Repo = "poet77/UniPrism_UniApp"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (Test-Path (Join-Path $PSScriptRoot "..\pages.json")) {
  $Root = Split-Path $PSScriptRoot -Parent
}

Set-Location $Root
Write-Host "Working directory: $Root"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "未安装 GitHub CLI。请运行: winget install GitHub.cli"
}

$auth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "请先登录 GitHub（浏览器授权一次即可）..."
  gh auth login --hostname github.com --git-protocol https --web
}

Write-Host "Creating repository $Repo (if not exists)..."
gh repo view $Repo 2>$null
if ($LASTEXITCODE -ne 0) {
  gh repo create $Repo --public --source=. --remote=origin --description "UniPrism WeChat mini-program (UniApp)"
  if ($LASTEXITCODE -ne 0) {
    gh repo create $Repo --private --source=. --remote=origin --description "UniPrism WeChat mini-program (UniApp)"
  }
} else {
  git remote remove origin 2>$null
  git remote add origin "https://github.com/$Repo.git"
}

git checkout main
git push -u origin main
git checkout feature/xiaochengxu
git push -u origin feature/xiaochengxu

Write-Host "Done: https://github.com/$Repo"
