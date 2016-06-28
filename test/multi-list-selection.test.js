'use babel'

import MultiListSelection from '../src/multi-list-selection'
import {assert} from 'chai'

describe('MultiListSelection', () => {
  describe('constructing a MultiListSelection instance', () => {
    let mls
    beforeEach(() => {
      mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e'],
        ['f', 'g', 'h']
      ])
    })

    it('marks first list as selected, as well as its first item', () => {
      assert.equal(mls.getSelectedListIndex(), 0)
      assert.equal(mls.getSelectedItemIndexForList(0), 0)
      assert.equal(mls.getSelectedItem(), 'a')
    })

    it('selects the first item from each list', () => {
      assert.equal(mls.getSelectedItemIndexForList(0), 0)
      assert.equal(mls.getSelectedItemIndexForList(1), 0)
      assert.equal(mls.getSelectedItemIndexForList(2), 0)
    })
  })

  describe('selectListAtIndex(index)', () => {
    it('selects the list at the given index', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e'],
        ['f', 'g', 'h']
      ])
      assert.equal(mls.getSelectedListIndex(), 0)
      assert.equal(mls.getSelectedItem(), 'a')

      mls.selectListAtIndex(1)
      assert.equal(mls.getSelectedListIndex(), 1)
      assert.equal(mls.getSelectedItem(), 'd')

      mls.selectListAtIndex(2)
      assert.equal(mls.getSelectedListIndex(), 2)
      assert.equal(mls.getSelectedItem(), 'f')
    })
  })

  describe('selectItemAtLocation([listIndex, itemIndex])', () => {
    it('selects the item at the given location', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e'],
        ['f', 'g', 'h']
      ])

      mls.selectItemAtLocation([0, 1])
      assert.equal(mls.getSelectedItem(), 'b')

      mls.selectItemAtLocation([1, 0])
      assert.equal(mls.getSelectedItem(), 'd')

      mls.selectItemAtLocation([2, 2])
      assert.equal(mls.getSelectedItem(), 'h')
    })

    it('remembers which item is selected for each list', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e'],
        ['f', 'g', 'h']
      ])

      mls.selectItemAtLocation([0, 1])
      assert.equal(mls.getSelectedItem(), 'b')
      mls.selectItemAtLocation([1, 0])
      assert.equal(mls.getSelectedItem(), 'd')
      mls.selectItemAtLocation([2, 2])
      assert.equal(mls.getSelectedItem(), 'h')

      mls.selectListAtIndex(0)
      assert.equal(mls.getSelectedItem(), 'b')

      mls.selectListAtIndex(1)
      assert.equal(mls.getSelectedItem(), 'd')

      mls.selectListAtIndex(2)
      assert.equal(mls.getSelectedItem(), 'h')
    })
  })

  describe('converting between local and global indexes', () => {
    describe('getGlobalItemIndex([localListIndex, localItemIndex])', () => {
      it('returns the index corresponding to the concatenated lists', () => {
        const mls = new MultiListSelection([
          ['a', 'b', 'c'],
          ['d', 'e'],
          ['f', 'g', 'h']
        ])

        let globalIndex

        globalIndex = mls.getGlobalItemIndex([0, 0])
        assert.equal(globalIndex, 0)

        globalIndex = mls.getGlobalItemIndex([1, 0])
        assert.equal(globalIndex, 3)

        globalIndex = mls.getGlobalItemIndex([2, 0])
        assert.equal(globalIndex, 5)
      })
    })

    describe('getLocalItemLocation(globalItemIndex)', () => {
      it('returns a tuple [listIndex, itemIndex]', () => {
        const mls = new MultiListSelection([
          ['a', 'b', 'c'],
          ['d', 'e'],
          ['f', 'g', 'h']
        ])

        let localLocation

        assert.throws(function () {
          mls.getLocalItemLocation(-1)
        })

        assert.throws(function () {
          mls.getLocalItemLocation(100)
        })

        localLocation = mls.getLocalItemLocation(0)
        assert.deepEqual(localLocation, [0, 0])

        localLocation = mls.getLocalItemLocation(4)
        assert.deepEqual(localLocation, [1, 1])

        localLocation = mls.getLocalItemLocation(7)
        assert.deepEqual(localLocation, [2, 2])
      })
    })
  })

  describe('selectItem(item)', () => {
    it('selects the provided item', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e']
      ])

      mls.selectItem('b')
      assert.equal(mls.getSelectedItem(), 'b')

      mls.selectItem('e')
      assert.equal(mls.getSelectedItem(), 'e')
    })
  })

  describe('moveListSelection(steps) (move forward with steps>0 and backward with steps<0)', () => {
    it('selects the appropriate list', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e'],
        ['f', 'g', 'h'],
        ['i']
      ])
      assert.equal(mls.getSelectedListIndex(), 0)

      mls.moveListSelection(1)
      assert.equal(mls.getSelectedListIndex(), 1)

      mls.moveListSelection(2)
      assert.equal(mls.getSelectedListIndex(), 3)

      mls.moveListSelection(-1)
      assert.equal(mls.getSelectedListIndex(), 2)

      mls.moveListSelection(-2)
      assert.equal(mls.getSelectedListIndex(), 0)
    })

    it('wraps around at the beginning and end lists', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e'],
        ['f', 'g', 'h'],
        ['i']
      ])
      assert.equal(mls.getSelectedListIndex(), 0)

      mls.moveListSelection(-1)
      assert.equal(mls.getSelectedListIndex(), 3)

      mls.moveListSelection(1)
      assert.equal(mls.getSelectedListIndex(), 0)

      mls.moveListSelection(-2)
      assert.equal(mls.getSelectedListIndex(), 2)

      mls.moveListSelection(3)
      assert.equal(mls.getSelectedListIndex(), 1)

      mls.moveListSelection(-8)
      assert.equal(mls.getSelectedListIndex(), 1)

      mls.moveListSelection(12)
      assert.equal(mls.getSelectedListIndex(), 1)
    })
  })

  describe('moveItemSelection(steps)', () => {
    describe('movement within a list (move forward with steps>0 and backward with steps<0)', () => {
      it('selects the appropriate item within the list', () => {
        const mls = new MultiListSelection([
          ['a', 'b', 'c', 'd']
        ])
        assert.equal(mls.getSelectedItem(), 'a')

        mls.moveItemSelection(1)
        assert.equal(mls.getSelectedItem(), 'b')

        mls.moveItemSelection(2)
        assert.equal(mls.getSelectedItem(), 'd')

        mls.moveItemSelection(-1)
        assert.equal(mls.getSelectedItem(), 'c')

        mls.moveItemSelection(-2)
        assert.equal(mls.getSelectedItem(), 'a')
      })
    })

    describe('movement across a list boundary', () => {
      it('selects the appropriate item within the next list', () => {
        const mls = new MultiListSelection([
          ['a', 'b', 'c'],
          ['d', 'e'],
          ['f', 'g', 'h']
        ])

        mls.selectItemAtLocation([0, 2])
        assert.equal(mls.getSelectedItem(), 'c')

        mls.moveItemSelection(1)
        assert.equal(mls.getSelectedItem(), 'd')

        mls.moveItemSelection(-1)
        assert.equal(mls.getSelectedItem(), 'c')

        mls.moveItemSelection(3)
        assert.equal(mls.getSelectedItem(), 'f')

        mls.moveItemSelection(-3)
        assert.equal(mls.getSelectedItem(), 'c')
      })
    })

    describe('movement at the beginning and end of all lists', () => {
      it('wraps around at the end of the last list and the beginning of the first list', () => {
        const mls = new MultiListSelection([
          ['a', 'b', 'c'],
          ['d', 'e'],
          ['f', 'g', 'h']
        ])

        mls.selectItemAtLocation([0, 0])
        assert.equal(mls.getSelectedItem(), 'a')

        mls.moveItemSelection(-1)
        assert.equal(mls.getSelectedItem(), 'h')

        mls.moveItemSelection(1)
        assert.equal(mls.getSelectedItem(), 'a')
      })
    })
  })

  describe('updateLists(lists)', () => {
    it('throws an error if too many or too few lists are passed', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e']
      ])

      assert.throws(function () {
        mls.updateLists([
          ['a', 'b', 'c']
        ])
      })

      assert.throws(function () {
        mls.updateLists([
          ['a', 'b', 'c'],
          ['d', 'e'],
          ['f', 'g']
        ])
      })
    })

    it('maintains the selected items for each list, even if location has changed in list', () => {
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e']
      ])

      mls.selectItemAtLocation([0, 1])
      assert.equal(mls.getSelectedItem(), 'b')
      mls.selectItemAtLocation([1, 1])
      assert.equal(mls.getSelectedItem(), 'e')

      mls.updateLists([
        ['b', 'c'],
        ['a', 'd', 'e']
      ])

      mls.selectListAtIndex(0)
      mls.getSelectedItem('b')

      mls.selectListAtIndex(1)
      mls.getSelectedItem('e')
    })

    describe('when list item is no longer in the list upon update', () => {
      describe('when there is a new item in its place', () => {
        it('keeps the same selected item index and shows the new item as selected', () => {
          const mls = new MultiListSelection([
            ['a', 'b', 'c']
          ])

          mls.selectItemAtLocation([0, 0])
          assert.equal(mls.getSelectedItem(), 'a')

          mls.updateLists([
            ['b', 'c']
          ])
          assert.equal(mls.getSelectedItem(), 'b')

          mls.updateLists([
            ['b', 'c']
          ])
          assert.equal(mls.getSelectedItem(), 'b')
        })
      })

      describe('when there is no item in its place, but there is still an item in the list', () => {
        it('selects the last item in the list', () => {
          const mls = new MultiListSelection([
            ['a', 'b', 'c']
          ])

          mls.selectItemAtLocation([0, 2])
          assert.equal(mls.getSelectedItem(), 'c')

          mls.updateLists([
            ['a', 'b']
          ])
          assert.equal(mls.getSelectedItem(), 'b')

          mls.updateLists([
            ['a']
          ])
          assert.equal(mls.getSelectedItem(), 'a')
        })
      })

      describe('when there are no more items in the list', () => {
        describe('when there is a non-empty list following the selected list', () => {
          it('selects the first item in the following list', () => {
            const mls = new MultiListSelection([
              ['a'],
              ['b', 'c']
            ])

            mls.selectItemAtLocation([0, 0])
            assert.equal(mls.getSelectedItem(), 'a')

            mls.updateLists([
              [],
              ['b', 'c']
            ])
            assert.equal(mls.getSelectedItem(), 'b')
          })
        })

        describe('when the following list is empty, but the preceeding list is non-empty', () => {
          it('selects the last item in the preceeding list', () => {
            const mls = new MultiListSelection([
              ['a', 'b'],
              ['c']
            ])

            mls.selectItemAtLocation([1, 0])
            assert.equal(mls.getSelectedItem(), 'c')

            mls.updateLists([
              ['a', 'b'],
              []
            ])
            assert.equal(mls.getSelectedItem(), 'b')
          })
        })
      })
    })

    it('uses provided equality predicate to determine if items match', () => {
      const equalityPredicate = (a, b) => a.toUpperCase() === b.toUpperCase()
      const mls = new MultiListSelection([
        ['a', 'b', 'c'],
        ['d', 'e']
      ], equalityPredicate)

      mls.updateLists([
        ['B', 'C'],
        ['A', 'D', 'E']
      ])

      mls.selectListAtIndex(0)
      mls.getSelectedItem('B')

      mls.selectListAtIndex(1)
      mls.getSelectedItem('E')
    })
  })
})
