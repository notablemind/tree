
var expect = require('expect.js')
  , lib = require('../utils')

var cases = {
  toMap: [
    ['should mappify a simple tree',
      {
        id: 'one'
      },
      {'one': {children: []}}
    ],
    ['should mappify a complex tree',
      {
        id: 'one',
        children: [{
          id: 'two',
        }, {
          id: 'three',
          children: [{
            id: 'four'
          },
          {
            id: 'five'
          }]
        }]
      },
      {
        one: {children: ['two', 'three']},
        two: {children: []},
        three: {children: ['four', 'five']},
        four: {children: []},
        five: {children: []}
      }
    ]
  ],
  fromMap: [
    ['should unmap a simple map',
      'one',
      {one: {children: []}},
      {id: 'one'}
    ],
    ['should unmap a complex tree',
      'one',
      {
        one: {children: ['two', 'three']},
        two: {children: []},
        three: {children: ['four']},
        four: {children: []}
      },
      {
        id: 'one',
        children: [{
          id: 'two',
        }, {
          id: 'three',
          children: [{
            id: 'four'
          }]
        }]
      }
    ]
  ]
}

describe('utils', function () {
  Object.keys(cases).forEach(function (name) {
    describe(name, function () {
      cases[name].forEach(function (cas) {
        it(cas[0], function () {
          var result = cas[cas.length - 1]
          expect(lib[name].apply(null, cas.slice(1, -1))).to.eql(result)
        })
      })
    })
  })
})

