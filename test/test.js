const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('node:test');

chai.use(chaiHttp);

var assert = chai.assert;

describe('Array', function() {
  it('should have a length of 0', function() {
    var arr = [];
    assert.equal(arr.length, 0);
  });
});

describe('API for AllProducts', function() {
  it ('should return correct data from the ProductsAPI', () => {
    chai.request('http://localhost:3002')
    .get('/products')
    .end((err, res) => {
      //console.log(res);
      assert.equal(res.status, 200, 'status should be 200');
      assert.equal(res.body.length, 100, 'length should be 100' );
      // expect(res).to.have.status(200);
      // expect(res.body).to.have.length(100);
    })
  })
});

describe('API for one product', function() {
  it ('should return correct data from one product API', () => {
    chai.request('http://localhost:3002')
    .get('/products/2')
    .end((err, res) => {
      console.log(res.body);
      assert.equal(res.status, 200, 'status should be 200');
      assert.equal(res.body.id, 2, 'it should be 2');
     // expect(res).to.have.status(200);
      // expect(res.body).to.have('Accessories');
      // expect(res.body).to.have.include(2);
    });
  })
})
