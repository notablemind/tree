
var expect = require('expect.js')
  , _ = require('lodash')
  , lib = require('../states')

function checkTrans(trail, from, to, fn) {
  var res = fn(trail, from) || from
  expect(res).to.eql(to)
  /*
  for (var name in to) {
    expect(comp[name]).to.eql(to[name])
  }
  */
}

var cases = {
  up: [
    ['when in the middle',
      [0, 2],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'three'},
          {value: 'four'}
        ]
      }],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'four'},
          {value: 'three'},
        ]
      }]
    ],
    ['when at to top (noop)',
      [0, 0],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'three'},
          {value: 'four'}
        ]
      }],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'three'},
          {value: 'four'},
        ]
      }]
    ]
  ],
  down: [
    ['when in the middle',
      [0, 1],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'three'},
          {value: 'four'}
        ]
      }],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'four'},
          {value: 'three'},
        ]
      }]
    ],
    ['when at the bottom (noop)',
      [0, 2],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'three'},
          {value: 'four'}
        ]
      }],
      [{
        value: 'one',
        children: [
          {value: 'two'},
          {value: 'three'},
          {value: 'four'},
        ]
      }]
    ],
  ],
  left: {
    master: [
      {value: 'two'},
      {
        value: 'three',
        children: [
          {value: 'four'},
          {value: 'five'},
          {value: 'six'}
        ]
      },
      {value: 'seven'}
    ],
    tests: [
      ['when at the top of the children',
        [1, 0],
        [
          {value: 'two'},
          {
            value: 'three',
            children: [
              {value: 'five'},
              {value: 'six'}
            ]
          },
          {value: 'four'},
          {value: 'seven'}
        ]
      ],
      ['when in the middle',
        [1, 1],
        [
          {value: 'two'},
          {
            value: 'three',
            children: [
              {value: 'four'},
              {value: 'six'}
            ]
          },
          {value: 'five'},
          {value: 'seven'}
        ]
      ],
      ['when at the end',
        [1, 2],
        [
          {value: 'two'},
          {
            value: 'three',
            children: [
              {value: 'four'},
              {value: 'five'},
            ]
          },
          {value: 'six'},
          {value: 'seven'}
        ]
      ],
      ['at the top level (noop)',
        [1],
        [
          {value: 'two'},
          {
            value: 'three',
            children: [
              {value: 'four'},
              {value: 'five'},
              {value: 'six'},
            ]
          },
          {value: 'seven'}
        ]
      ],
    ]
  },
  right: {
    master: [
      {value: 'two'},
      {
        value: 'three',
        children: [
          {value: 'four'},
          {value: 'five'},
          {value: 'six'}
        ]
      },
      {value: 'seven'}
    ],
    tests: [
      ['at the top (noop)',
        [1, 0],
        [
          {value: 'two'},
          {
            value: 'three',
            children: [
              {value: 'four'},
              {value: 'five'},
              {value: 'six'}
            ]
          },
          {value: 'seven'}
        ],
      ],
      ['in the middle',
        [1, 1],
        [
          {value: 'two'},
          {
            value: 'three',
            children: [
              {
                value: 'four',
                children: [
                  {value: 'five'},
                ]
              },
              {value: 'six'}
            ]
          },
          {value: 'seven'}
        ],
      ],
      ['at the end',
        [1, 2],
        [
          {value: 'two'},
          {
            value: 'three',
            children: [
              {value: 'four'},
              {
                value: 'five',
                children: [
                  {value: 'six'},
                ]
              },
            ]
          },
          {value: 'seven'}
        ],
      ],
      ['with children',
        [1],
        [
          {
            value: 'two',
            children: [
              {
                value: 'three',
                children: [
                  {value: 'four'},
                  {value: 'five'},
                  {value: 'six'},
                ]
              },
            ]
          },
          {value: 'seven'}
        ],
      ],
    ]
  }
}



Object.keys(cases).forEach(function (name) {
  describe(name, function () {
    var tests = cases[name]
      , master = null
    if (!Array.isArray(tests)) {
      master = tests.master
      tests = tests.tests
    }
    tests.forEach(function (cas) {
      it(cas[0], function () {
        var trail = cas[1]
          , from = cas[2]
          , to = cas[3]
        if (cas.length === 3) {
          to = cas[2]
          from = _.cloneDeep(master)
        }
        checkTrans(trail, from, to, lib[name])
      })
    })
  })
})



