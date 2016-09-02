declare module "events" {
  // TODO: See the comment above the events$EventEmitter declaration
  declare class EventEmitter {
    static EventEmitter: typeof EventEmitter;
    // deprecated
    static listenerCount(emitter: events$EventEmitter, event: string): number;

    addListener(event: string, listener: Function): events$EventEmitter;
    emit(event: string, ...args:Array<any>): boolean;
    listeners(event: string): Array<Function>;
    listenerCount(event: string): number;
    on(event: string, listener: Function): events$EventEmitter;
    once(event: string, listener: Function): events$EventEmitter;
    removeAllListeners(event?: string): events$EventEmitter;
    removeListener(event: string, listener: Function): events$EventEmitter;
    setMaxListeners(n: number): void;
    getMaxListeners(): number;
  }

  declare export var EventEmitter: typeof EventEmitter
  declare export default typeof EventEmitter
}
