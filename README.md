# useEffectWithComparator

It's `React.useEffect` except that it takes a custom comparator-function so that you have more control over when it re-runs.

## Quick start

> Caution: this hook circumvents some of the guardrails that React put in place. Use it only if you're sure about what you're doing.

```js
const ShoppingCart = props => {
  const {
    items, // e.g. ['apples', 'bananas', 'carrots']
  } = props;

  const [totalPrice, setTotalPrice] = React.useState();

  // first two args are the same as `React.useEffect`
  // last arg is a comparison function
  // if the comparator returns `false`, the effect will re-run
  // if it returns `true`, the the effect will not re-run
  useEffectWithComparator(
    () => {
      fetchPrices(items).then(setTotalPrice);
    },
    [items, setTotalPrice],
    // custom comparison function
    (prevDeps, currentDeps) => {
      const [prevItems, prevSetTotalPrice] = prevDeps;
      const [currentItems, currentSetTotalPrice] = currentDeps;

      return (
        prevSetTotalPrice === currentSetTotalPrice) &&
        prevItems.length === currentItems.length &&
        currentItems.every(item => prevItems.includes(item));
      );
    }
  );
};
```

## Why?

`React.useEffect` allows you to synchronize side-effects with your component's state. You pass it an array of values that it should synchronize with (the _dependency array_), and it will only re-run the effect if it thinks that one of those values has changed. Simple enough.

However, we have no control over the logic that it uses in order to decide if the values in the dependency array have materially changed or not. `React.useEffect` uses _referential equality_ to determine whether a previous value is the same as the current value. Referential equality comparisons are super fast, but will fail to recognize when two values are _practically the same_ but not _strictly the same_.

e.g.

```js
// triple-equals demonstrates referential equality

// even though these objects are practically the same,
// they are not strictly the same object
// so these return `false`
{ a: 'apple' } === { a: 'apple' } // false
[1, 2, 3] === [1, 2, 3] // false
```

In order for React to recognize that these values are practically the same, React would have to perform a _deep equality check_ which involves looping over every single value/property (including nested properties) of the object/array. This could cause serious performance issues if we were dealing with really big, gnarly, complex objects and that's why React chose referential equality instead.

> `useEffectWithComparator` removes these guardrails and lets you compare your values however you want

For example, you might know that your values are not very complicated and that performing a deep-equality check wouldn't cause a perf issue. Or you might know that every one of your values has an `id` prop and that if two values have the same `id`, they can be treated as equal.

Maybe you're publishing a component to NPM and you don't want your users to have memoize the values that they're sending to you.

## See also

A similar concept for `React.useMemo` - [react-use-memo-with-comparator](https://www.npmjs.com/package/react-use-memo-with-comparator)
A solution for the common deep-equality use-case - [use-deep-compare-effect](https://www.npmjs.com/package/use-deep-compare-effect)
