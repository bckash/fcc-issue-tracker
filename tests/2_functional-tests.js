const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const currentDate = new Date()

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    suite("request to /api/issues/{project}", function(){

        suite("POST", function(){
            test("Create an issue with every field", function(done){
                chai
                .request(server)
                .keepOpen()
                .post("/api/issues/test")
                .send({
                    issue_title: "test title",
                    issue_text: "text title",
                    created_by: "test author",
                    assigned_to: "whoever",
                    status_text: "status"
                })
                .end(function(err, res){
                    assert.equal(res.body.issue_title, "test title");
                    done()
                })
            })
            test("Create an issue with only required fields", function(done){
                chai
                .request(server)
                .keepOpen()
                .post("/api/issues/test")
                .send({
                    issue_title: "test title",
                    issue_text: "text title",
                    created_by: "test author",
                })
                .end(function(err, res){
                    assert.equal(res.body.issue_title, "test title");
                    assert.equal(res.body.issue_text, "text title");
                    assert.equal(res.body.created_by, "test author");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.status_text, "");
                    done()
                })
            })
            test("Create an issue with missing required fields", function(done){
                chai
                .request(server)
                .keepOpen()
                .post("/api/issues/test")
                .send({
                    issue_title: "",
                    issue_text: "",
                    created_by: "",
                })
                .end(function(err, res){
                    assert.deepEqual(res.body, { error: 'required field(s) missing' });
                    done()
                })
            })
        })

        suite("POST", function(){

        })

        suite("PUT", function(){

        })

        suite("DELETE", function(){

        })
    })
});
