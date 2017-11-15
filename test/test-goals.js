const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiHtml  = require('chai-html');

const {app} = require('../server');

const should = chai.should();

chai.use(chaiHttp);
chai.use(chaiHtml);

const request = require('request');
const expect = require('chai').expect



describe('Status and content', function() {
    describe ('Main page', function(done) {
        it('status', function(){
            request('http://localhost:8080/', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                
            });
        });
        it('content', function(done) {
            request('http://localhost:8080/' , function(error, response, body) {
                expect('<p>Hello World!</p>').html.to.equal('<p>Hello World!</p>');
                done();
            });
        });
    });
});