// @flow

// A mostly pain-free way to integrate node_modules into your flow
// Warning, node_modules has plenty of dragons for flow...
export type {Gulp} from 'gulp'

// Not sure what goes in this, seems like name of plugin and functions or
// objects... I'm leaving it as just Object, which is usually frowned upon
// because pretty much everything is Object.
export type PluginObject = Object

// Based on what I see going in...
// Note that all keys are optional since TaskHandler can default this to being
// an empty object. If this automatically gets extended with default config
// options, that needs to happen in TaskHandler#constructor for happy flow
export type ConfigObject = {
  environment?: {
    assetPath: string,
    env: 'development' | 'test' |'production',
    isCi: boolean,
    isDev: boolean,
    isLocalDev: boolean,
  },
  metadata?: {
    name: string,
  },
  sources?: {
    buildDir: string,
    devPath: string,
    devPort: number,
    protocol: string,
    srcDir: string,
  },
  utils?: {
    addbase: Function,
    addroot: Function,
    addTarget: Function,
  },
}
