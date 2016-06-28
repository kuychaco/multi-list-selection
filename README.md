# multi-list-selection

Library for managing selections across multiple lists

![Lists everywhere](https://cdn.meme.am/instances/500x/67302224.jpg)

## Installation

```
npm install [--save] multi-list-selection
```

## Usage

**`new MultiListSelection(lists[, equalityPredicate])`**

Constructs a new MultiListSelection instance

* `lists` - an array of lists, each lists an array of items
* `equalityPredicate` - an optional function used to compare item equality when lists are updated (to maintain selected items). Reference equality is default.

### Prototype methods:

**`getSelectedItem()`**

Returns currently selected items

**`selectItem(item)`**

Selects item provided. Uses `equalityPredicate` to find item in lists if provided

**`getListAtIndex(listIndex)`**

Returns list at provided `listIndex`

**`selectListAtIndex(listIndex)`**

Sets the list at `listIndex` as selected

**`getSelectedListIndex()`**

Returns index of selected lists

**`moveListSelection(steps)`**

Takes a number of steps and jumps that many lists forward (steps > 0) or backwards (steps < 0), wrapping around at beginning/end

**`moveItemSelection(steps)`**

Takes a number of steps and jumps that many items forward (steps > 0) or backwards (steps < 0), wrapping around at beginning/end

**`updateLists(newLists)`**

Updates the lists to be lists provided. The library maintains the selected items for each list, even if its location has changed within the list. Uses `equalityPredicate` if provided, otherwise checks reference equality between items on old and new lists.

* newLists - new versions of the lists initially provided to the constructor


## Examples


```javascript
mls = new MultiListSelection([
  ['a', 'b', 'c'],
  ['d', 'e'],
  ['f', 'g', 'h']
])

mls.getSelectedItem() // 'a'
```

#### Selecting an item:
Uses `equalityPredicate` if provided
```javascript
mls.selectItem('b')
mls.selectItem('g')
```

#### Getting and selecting a list:
```javascript
mls.getListAtIndex(1) // ['d', 'e']

mls.selectListAtIndex(1)
mls.getSelectedListIndex() // 1
```
Each list has it's own selected item (initially the first item).
```javascript
mls.selectListAtIndex(0)
mls.getSelectedItem() // 'b'

mls.selectListAtIndex(2)
mls.getSelectedItem() // 'g'
```

#### Navigating between lists:
`moveListSelection(steps)` takes a number of steps and jumps that many lists forward (steps > 0) or backwards (steps < 0), wrapping around at beginning/end
```javascript
mls = new MultiListSelection([
  ['list at index 0'],
  ['list at index 1'],
  ['list at index 2']
])
mls.selectListAtIndex(1) // starting with list at index 1
mls.moveListSelection(1) // moves forward to list at index 2
mls.moveListSelection(1) // wraps to move forward to list at index 0

mls.selectListAtIndex(1) // starting with list at index 1
mls.moveListSelection(-1) // moves back to list at index 0
mls.moveListSelection(-1) // wraps to move back to list at index 2

mls.selectListAtIndex(1) // starting with list at index 1
mls.moveListSelection(2) // moves forward two lists and wraps to list at index 0

mls.selectListAtIndex(1) // starting with list at index 1
mls.moveListSelection(-2) // moves back two lists and wraps to list at index 2
```

#### Navigating between items:
`moveItemSelection(steps)` takes a number of steps and jumps that many items forward (steps > 0) or backwards (steps < 0), wrapping around at beginning/end
```javascript
const mls = new MultiListSelection([
  ['a', 'b'],
  ['c', 'd']
])

mls.selectItem('a')
mls.moveItemSelection(1) // selects 'b'
mls.moveItemSelection(-1) // selects 'a'
mls.moveItemSelection(2) // selects 'c'
mls.moveItemSelection(-2) // selects 'a'
mls.moveItemSelection(-1) // wraps around to selects 'd'
mls.moveItemSelection(1) // wraps around to selects 'a'
```

#### Updating lists:
```javascript
const mls = new MultiListSelection([
  ['a', 'b'],
  ['c', 'd']
])

mls.updateLists([
  ['a'],
  ['b', 'c', 'd']
])
```
The library maintains the selected items for each list, even if its location has changed within the list.

If the selected list item is no longer in the list, the item in its location will be selected. If there is no item in present at that location, the last item in the list will be selected.

If the focused list is empty upon update, the first item in the next list will be set as selected. If that list is empty as well, then the last item in the previous list will be selected.

See test cases in `test` folder for more details on this behavior.

Checking for equality during update:
By default the library using reference equality but you can provide an `equalityPredicate`
```javascript
const equalityPredicate = (a, b) => a.toUpperCase() === b.toUpperCase()

const mls = new MultiListSelection([
  ['a', 'b', 'c']
], equalityPredicate)

mls.selectItem('b')

mls.updateLists([
  ['Z', 'A', 'B', 'C']
])

mls.getSelectedItem() // 'B'
```
