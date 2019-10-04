var chai = require('chai');
var mocha = require('mocha');
let chaiHttp = require('chai-http');
var expect = chai.expect;
let should = chai.should();
var app = require('../src/app');
chai.use(chaiHttp);

describe('/GET orders', () => {
    it('it should GET all the orders', (done) => {
          chai.request(app)
          .get('/v1/orders')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.orders.should.be.a('array');
                //res.body.length.should.be.eql(0);
            done();
          });
    });
});

describe('/POST order', () => {
    it('it should POST an order', (done) => {
        let order = {
            first_name: "Mr X",
            status: "created"
        };
        chai.request(app)
            .post('/v1/orders')
            .send(order)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.order.should.be.a('object');
                res.body.order.should.have.property('_id');
                res.body.order.should.have.property('status');
                res.body.order.should.have.property('pin');
                res.body.order.should.have.property('customer');
                done();
            });
    });

});

/*
describe('createOrder', function(){
    it('should return validation error', function(){
        let postData = {

        }
    });
    it('should create an order', function(){

    });
});*/