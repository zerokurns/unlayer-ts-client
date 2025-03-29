// src/global.d.ts

// Augment the global ErrorConstructor interface to include the V8-specific captureStackTrace method
declare global {
  interface ErrorConstructor {
    /**
     * Creates a .stack property on targetObject, which when accessed returns a string representing
     * the location in the code at which Error.captureStackTrace() was called.
     * @see https://v8.dev/docs/stack-trace-api#errorcapturestacktrace
     */
    captureStackTrace?(targetObject: object, constructorOpt?: (...args: unknown[]) => unknown): void;
  }
}

// Export {} to treat this file as a module and make the global augmentation work.
export {}; 