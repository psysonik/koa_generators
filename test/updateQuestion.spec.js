var app = require("./../app.js").app;
var server = require("./../app.js").server;
var request = require("supertest");
var db = require("./../lib/db.js")

var testHelpers = require("./helpers.js");
var co = require("co");
var should = require("should");

describe("Updating questions",function(){

	beforeEach(function(done){
		testHelpers.removeAllDocs(done);
	});

	afterEach(function(done){
		testHelpers.removeAllDocs(done);
	})



	it("shows a nice page for existing questions", function(done){
		co(function *(){
			var q = yield db.questions.insert({
				title: "A question?",
				tags: ["tag1", "tag2"]
			});
			request(server)
			.get("/question/" + q._id)
			.expect("Content-Type",/html/)
			.expect(function(res){
				res.text.should.containEql(q.title);
				res.text.should.containEql("tag1, tag2");
			})
			.expect(200,done);
		})
	});

	it("Updates an existing question",function(done){
		co(function *(){
			var q = yield db.questions.insert({
				title : "A question?",
				tags : ["tag1", "tag2"]
			});

			request(server)
			.post("/question/"+ q._id)
			.send({
				questionTitle : "An updated question",
				tagString : "tag3, tag4"
			})
			.expect("Location","/question/" + q._id)
			.expect(302,done);
		});
	});
})