$currentpath=Get-Item env:PATH;if($currentpath.Value -like '*C:\iperf*'){}else{[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\iperf", [EnvironmentVariableTarget]::Machine)}
