import * as R from "ramda";

const myids1 = ["abc", "def", "qew"];
const myids = ["123", "dog", "cat"];

const nums = [0, 1, 3, 4, 5];
/*
const eq1 = equals(1)
findIndex(eq1, nums)

const eq3 = equals(3)
const currentIndex = findIndex(equals("qew"), ids)

const newIndex = inc(currentInde
  x)

nth(newIndex, ids)

*/
const makeGetNextId = (ids) =>
  R.pipe(
    R.equals,
    R.findIndex(R.__, ids),
    R.inc,
    R.nth(R.__, ids),
    R.defaultTo(R.head(ids))
  );

const newIds = R.pipe(R.append("foo"), R.without("dog"))(myids);

// newIds = 123, cat, foo

const getNextId = makeGetNextId(newIds);

getNextId("dog");

/*
Put in abc, get def

1.) get the index from the recieved id
2.) increment the index by one
3.) return the value of the new index

/* 
input abc
index 0
index 0 -> 1
index 1 -> def


input def
index 1
index 1 -> 2
index 2 -> qew


input qew
index 2
index 2 -> 3
index 3 -> undefined

if length>index
continue

if length = index
stop

if length< index
sop
*/
