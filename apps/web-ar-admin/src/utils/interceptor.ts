export type Interceptor = (
  ...args: any[]
) => boolean | Promise<boolean> | undefined;

export function callInterceptor(
  interceptor: Interceptor | undefined,
  {
    args = [],
    done,
    canceled,
    error,
  }: {
    args?: unknown[];
    canceled?: () => void;
    done: () => void;
    error?: () => void;
  },
) {
  if (interceptor) {
    const returnVal = interceptor(...args);
    if (returnVal && typeof (returnVal as any).then === 'function') {
      (returnVal as Promise<boolean>)
        .then((value) => {
          if (value) done();
          else if (canceled) canceled();
        })
        .catch(error ?? (() => {}));
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
