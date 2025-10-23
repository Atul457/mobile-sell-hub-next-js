type ILoggerArgs = {
  module: string
  message: string | string[]
}

const logger = (module: ILoggerArgs['module'], message: ILoggerArgs['message']) => {
  let message_ = message
  if (Array.isArray(message_)) {
    message_ = message_.join('\n')
  }
  message_ = `\n${module?.toUpperCase()}: \nTimestamp: ${new Date()}\nMessage: ${message_}`
  console.debug(message_)
}

export { logger }
