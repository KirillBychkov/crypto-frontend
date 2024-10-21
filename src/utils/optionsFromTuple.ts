export function optionsFromTuple<T extends string | number | boolean>(
  tuple: readonly T[]
) {
  return tuple.map(
    (item) =>
      ({ value: String(item), label: String(item) }) as {
        value: `${T}`;
        label: `${T}`;
      }
  );
}
