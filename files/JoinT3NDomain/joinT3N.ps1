if ((gwmi win32_computersystem).partofdomain -eq $true) {
  # write-host -fore green "I am domain joined!"
} else {
  # write-host -fore red "Ooops, workgroup!"
$domain = "T3N"
$password = "ChangeTh1s!" | ConvertTo-SecureString -asPlainText -Force
$username = "$domain\ernest.wilson" 
$credential = New-Object System.Management.Automation.PSCredential($username,$password)
Add-Computer -DomainName $domain -Credential $credential
}
