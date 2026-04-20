# helper script to allow ports in Windows Firewall
# Run this as Administrator

$ports = @(5000, 8081)
$ruleNamePrefix = "TaskMasterFlow"

foreach ($port in $ports) {
    $ruleName = "${ruleNamePrefix}_Inbound_${port}"
    Write-Host "Adding firewall rule for port $port ($ruleName)..."
    
    # Check if rule exists
    $existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host "Rule already exists. Removing..."
        Remove-NetFirewallRule -DisplayName $ruleName
    }
    
    New-NetFirewallRule -DisplayName $ruleName `
                        -Direction Inbound `
                        -Action Allow `
                        -Protocol TCP `
                        -LocalPort $port `
                        -Description "Allow inbound traffic for Task Master Flow development"
}

Write-Host "✅ Firewall rules updated successfully."
