export interface Logger {
  i(message: string): void;
  d(message: string): void;
  d(message: string, error: Error): void;
  e(message: string): void;
  e(message: string, error: Error): void;
}

class LoggerImpl implements Logger {
  tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  i(message: string): void {
    console.log(`tag = ${this.tag}, message = ${message}`);
  }

  d(message: string): void;
  d(message: string, error: Error): void;
  d(message: string, error?: Error): void {
    if (__DEV__) {
      let messageActual = `tag = ${this.tag}, message = ${message}`;
      if (error) {
        messageActual = messageActual + `, error = ${error}`;
      }
      console.debug(messageActual);
    }
  }

  e(message: string): void;
  e(message: string, error: Error): void;
  e(message: string, error?: Error): void {
    let messageActual = `tag = ${this.tag}, message = ${message}`;
    if (error) {
      messageActual = messageActual + `, error = ${error}`;
    }
    console.error(messageActual);
  }
}

export function createLogger(tag: string): Logger {
  return new LoggerImpl(tag);
}
