const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

let deleteID;

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
                    // all other fields the same way
                    deleteID = res.body._id
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

        suite("GET", function(){
            test("View issues on a project", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .get("/api/issues/chai-test-get")
                    .end(function(err, res){
                        assert.equal(res.body.length, 3)
                        assert.equal(res.body[0].issue_title, "bug")
                        assert.equal(res.body[1].issue_title, "problem")
                        done()
                    })
            })
            test("View issues on a project with one filter", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .get("/api/issues/chai-test-get?issue_title=problem")
                    .end(function(err, res){
                        assert.equal(res.body.length, 1)
                        assert.deepEqual(res.body[0], {
                            "issue_title":"problem",
                            "issue_text":"problem description ","created_by":"creator",
                            "assigned_to":"",
                            "status_text":"",
                            "created_on":"2023-07-09T12:05:23.247Z","updated_on":"2023-07-09T12:05:23.247Z",
                            "open":true,
                            "_id":"64aaa283de3c3fe0485af966"})
                        done()
                    })
            })
            test("View issues on a project with multiple filters", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .get("/api/issues/chai-test-get")
                    .query({
                        issue_title: "bug",
                        created_by: "creator"
                    })
                    .end(function(err, res){
                        assert.equal(res.body.length, 2)
                        assert.deepEqual(res.body, [
                            {
                                "issue_title":"bug",
                                "issue_text":"bug description","created_by":"creator",
                                "assigned_to":"",
                                "status_text":"","created_on":"2023-07-09T12:04:44.102Z","updated_on":"2023-07-09T12:04:44.102Z","open":true,
                                "_id":"64aaa25cde3c3fe0485af960"
                            },
                            {
                                "issue_title":"bug",
                                "issue_text":"bug description long","created_by":"creator",
                                "assigned_to":"",
                                "status_text":"","created_on":"2023-07-09T12:05:58.407Z","updated_on":"2023-07-09T12:05:58.407Z","open":true,
                                "_id":"64aaa2a6de3c3fe0485af96e"
                            }])
                        done()
                    })
            })
        })

        suite("PUT", function(){
            test("Update one field on an issue", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .put("/api/issues/chai-test-put")
                    .send({
                        _id: "64ac26cc9efa0a2e6aa748ff", 
                        issue_title: "updated title" 
                    })
                    .end(function(err, res){
                        assert.equal(res.body.result, "successfully updated")
                        assert.equal(res.body._id, "64ac26cc9efa0a2e6aa748ff")
                        done()
                    })
            })
            test("Update multiple fields on an issue", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .put("/api/issues/chai-test-put")
                    .send({
                        _id: "64ac26cc9efa0a2e6aa748ff", 
                        issue_title: "new title",
                        issue_text: "updated text",
                        assigned_to: "someone else"
                    })
                    .end(function(err, res){
                        assert.equal(res.body.result, "successfully updated")
                        assert.equal(res.body._id, "64ac26cc9efa0a2e6aa748ff")
                        done()
                    })
            })
            test("Update an issue with missing _id", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .put("/api/issues/chai-test-put")
                    .send({
                        issue_title: "new title",
                        issue_text: "updated text",
                        assigned_to: "someone else"
                    })
                    .end(function(err, res){
                        assert.equal(res.body.error, "missing _id")
                        done()
                    })
            })
            test("Update an issue with no fields to update", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .put("/api/issues/chai-test-put")
                    .send({
                        _id: "64ac26cc9efa0a2e6aa748ff"
                    })
                    .end(function(err, res){
                        assert.equal(res.body.error, "no update field(s) sent")
                        assert.equal(res.body._id, "64ac26cc9efa0a2e6aa748ff")
                        done()
                    })
            })
            test("Update an issue with an invalid _id", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .put("/api/issues/chai-test-put")
                    .send({
                        _id: "64ac26cc9efa0a2e6aa74666",
                        issue_title: "new title",
                        issue_text: "updated text",
                        assigned_to: "someone else"
                    })
                    .end(function(err, res){
                        assert.equal(res.body.error, "could not update")
                        assert.equal(res.body._id, "64ac26cc9efa0a2e6aa74666")
                        done()
                    })
            })
        })

        suite("DELETE", function(){
            test("Delete an issue", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .delete("/api/issues/test")
                    .send({
                        _id: deleteID,
                    })
                    .end(function(err, res){
                        assert.equal(res.body.result, "successfully deleted")
                        done()
                    })
            })
            test("Delete an issue with an invalid _id", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .delete("/api/issues/test")
                    .send({
                        _id: deleteID,
                    })
                    .end(function(err, res){
                        assert.equal(res.body.error, "could not delete")
                        done()
                    })
            })
            test("Delete an issue with missing _id", function(done){
                chai
                    .request(server)
                    .keepOpen()
                    .delete("/api/issues/test")
                    .send({ })
                    .end(function(err, res){
                        assert.equal(res.body.error, "missing _id")
                        done()
                    })
            })
        })
    })
});
