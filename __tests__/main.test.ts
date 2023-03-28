import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'


// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_UNREAL-ENGINE-VERSION'] = '5.0'
  process.env['INPUT_PLUGIN-PATH'] = 'd:/temp/TestPlugin/TestPlugin.uplugin'
  process.env['INPUT_OUTPUT-PATH'] = 'd:/temp/outci'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  try {
    const message = cp.execFileSync(np, [ip], options).toString()
    console.log(message)
  } catch (e: any) {
    console.log(e.message)
    console.log(e.stdout.toString())
    console.log(e.stderr.toString())
  }
})
