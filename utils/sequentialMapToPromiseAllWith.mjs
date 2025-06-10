// sequentialMapToPromiseAllWith :: (a -> Promise<b>) -> [a] -> Promise<[b]>
export const withRecursiveAsyncAwait = (fn) =>
  async function sequentialMapToPromiseAll([head, ...tail]) {
    if (!head) {
      return Promise.resolve([]);
    }
    const headResult = await fn(head);
    const tailResult = await sequentialMapToPromiseAll(tail);
    return [headResult, ...tailResult];
  };

export const withRecursiveNestedPromise = (fn) =>
  function sequentialMapToPromiseAll([head, ...tail]) {
    if (!head) {
      return Promise.resolve([]);
    }
    return fn(head).then((headResult) =>
      sequentialMapToPromiseAll(tail).then((tailResult) => [
        headResult,
        ...tailResult,
      ]),
    );
  };

export const withReduce = (fn) =>
  function sequentialMapToPromiseAll(list) {
    return list.reduce(async (previousP, elem) => {
      const previous = await previousP;
      const applied = await fn(elem);
      return previous.concat(applied);
    }, []);
  };

export const withLoop = (fn) =>
  async function sequentialMapToPromiseAll(list) {
    const result = [];
    for (const elem of list) {
      result.push(await fn(elem));
    }
    return result;
  };

export { withLoop as sequentialMapToPromiseAllWith };
