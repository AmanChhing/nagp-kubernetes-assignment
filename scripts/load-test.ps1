param(
  [int]$Jobs = 24,
  [int]$Duration = 120000
)

$ErrorActionPreference = "Stop"

1..$Jobs | ForEach-Object {
  Start-Job -ScriptBlock {
    param($Duration)
    Invoke-WebRequest "http://localhost/api/load?duration=$Duration" | Out-Null
  } -ArgumentList $Duration | Out-Null
}

kubectl get hpa products-api-hpa -n nagp-assignment -w
