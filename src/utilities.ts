import * as fs from 'fs'

const LAUNCHER_INSTALLED_DAT_PATH = 'C:/ProgramData/Epic/UnrealEngineLauncher/LauncherInstalled.dat'

export function getUnrealEngineInstallPath(version: string): string | undefined {
  const defaultInstallPath = `C:/Program Files/Epic Games/UE_${version}`
  if (fs.existsSync(defaultInstallPath)) {
    return defaultInstallPath
  } else {
    const launcherInstalledDat = JSON.parse(fs.readFileSync(LAUNCHER_INSTALLED_DAT_PATH, 'utf8'))
    for (const installation of launcherInstalledDat['InstallationList']) {
      const appName = installation['AppName']
      if (appName === `UE_${version}`) {
        return installation['InstallLocation']
      }
    }
  }
}

export function getAutomationToolExecutablePath(version: string): string {
  if (version.startsWith('4')) {
    return 'Engine/Binaries/DotNET/AutomationTool.exe'
  } else {
    return 'Engine/Binaries/DotNET/AutomationTool/AutomationTool.exe'
  }
}
