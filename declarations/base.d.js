// TODO: This is copypasta of the EventEmitter class signature exported from the
//       `events` module. The only reason this exists is because other module
//       interface definitions need to reference this type structure -- but
//       referencing type structures defined in other modules isn't possible at
//       the time of this writing.
// declare class events$EventEmitter {
  // // deprecated
  // static listenerCount(emitter: events$EventEmitter, event: string): number;

  // addListener(event: string, listener: Function): events$EventEmitter;
  // emit(event: string, ...args:Array<any>): boolean;
  // listeners(event: string): Array<Function>;
  // listenerCount(event: string): number;
  // on(event: string, listener: Function): events$EventEmitter;
  // once(event: string, listener: Function): events$EventEmitter;
  // removeAllListeners(event?: string): events$EventEmitter;
  // removeListener(event: string, listener: Function): events$EventEmitter;
  // setMaxListeners(n: number): void;
  // getMaxListeners(): number;
// }


// declare module "events" {
  // // TODO: See the comment above the events$EventEmitter declaration
  // declare class EventEmitter extends events$EventEmitter {
    // static EventEmitter: typeof EventEmitter;
  // }

  // declare var exports: typeof EventEmitter;
// }
