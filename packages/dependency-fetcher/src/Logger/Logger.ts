/* eslint-disable no-console */
export class Logger {
  private name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  public log: Console['log'] = (...args) => {
    console.log(`[${this.name}]`, ...args);
  };

  public error: Console['error'] = (...args) => {
    console.error(`[${this.name}]`, ...args);
  };

  public warn: Console['warn'] = (...args) => {
    console.warn(`[${this.name}]`, ...args);
  };

  public info: Console['info'] = (...args) => {
    console.info(`[${this.name}]`, ...args);
  };

  public debug: Console['debug'] = (...args) => {
    console.debug(`[${this.name}]`, ...args);
  };

  public trace: Console['trace'] = (...args) => {
    console.trace(`[${this.name}]`, ...args);
  };
}
