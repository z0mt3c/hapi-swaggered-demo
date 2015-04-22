var Code = require('code')
var Lab = require('lab')
var lab = exports.lab = Lab.script()

var describe = lab.describe
var it = lab.it
// var before = lab.before
// var after = lab.after
var expect = Code.expect
process.env.PORT = 8351
var server = require('../example')
var swaggerTools = require('swagger-tools')
var v2 = swaggerTools.specs.v2

describe('init', function () {
  it('feed', function (done) {
    server.inject('/swagger/swagger', function (res) {
      expect(res.result).to.exist()
      var cleaned = JSON.parse(JSON.stringify(res.result))
      v2.validate(cleaned, function (error, result) {
        expect(error).to.not.exist()
        expect(result).to.exist()
        if (result.errors.length > 0) {
          console.log(JSON.stringify(cleaned, null, '  '))
        }
        expect(result.errors).to.deep.equal([])
      })
      done()
    })
  })
})
