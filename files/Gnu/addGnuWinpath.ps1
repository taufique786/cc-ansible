$currentpath=Get-Item env:PATH;if($currentpath.Value -like '*C:\GnuWin\bin*'){}else{[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\GnuWin\bin", [EnvironmentVariableTarget]::Machine)}
