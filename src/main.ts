import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getAutomationToolExecutablePath, getUnrealEngineInstallPath} from './utilities'
import {ExecOptions} from '@actions/exec'
import path from 'path'

async function run(): Promise<void> {
  try {
    const unrealEngineVersion: string = core.getInput('unreal-engine-version')
    const pluginPath: string = core.getInput('plugin-path')
    const outputPath: string = core.getInput('output-path')

    const installPath = getUnrealEngineInstallPath(unrealEngineVersion)
    if (!installPath) {
      core.setFailed(`Unreal Engine version ${unrealEngineVersion} not found.`)
      return
    }
    core.debug(`Installation path: ${installPath}`)

    const automationPath = getAutomationToolExecutablePath(unrealEngineVersion)
    core.debug(`Automation path: ${automationPath}`)
    const automationExecutable = path.join(installPath, automationPath)
    core.debug(`Automation full path: ${automationExecutable}`)

    const options: ExecOptions = {
      // cwd: workingDirectory,
      silent: true,
      listeners: {
        stdout: (data: Buffer) => {
          const message = data.toString().trim()
          // console.log(message)
          if (message.match('.*\\((\\d*)\\): fatal error ([\\w\\d]*): .*') || message.match('ERROR: .*')) {
            core.error(message)
          } else if (message.match('.*\\((\\d*)\\): warning ([\\w\\d]*): .*') || message.match('WARNING: .*')) {
            core.warning(message)
          } else {
            core.info(message)
          }
        },
        stderr: (data: Buffer) => {
          core.error(data.toString().trim())
        }
      }
    }
    await exec.exec(`"${automationExecutable}"`, ['BuildPlugin', `-Plugin=${pluginPath}`, `-Package=${outputPath}`, '-Rocket'], options)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
