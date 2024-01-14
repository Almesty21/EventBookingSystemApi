const chai = require("chai");
const chaihttp = require("chai-http");
const server = require("../server");



chai.should();
chai.use(chaihttp);

describe("Event Booking Api events", () => {

    //Test Get
    describe("GET All events", () => {
        it("It should return al list of events", (done) => {
            chai.request(server)
                .get("/api/events")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status');
                    response.body.should.have.property('data')
                    done();
                })
        })
    })
})
describe("Event Booking Api of Users", () => {

    //Test Get
    describe("GET All Users", () => {
        it("It should return al list of Users", (done) => {
            chai.request(server)
                .get("/api/users")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status');
                    response.body.should.have.property('data')
                    done();
                })
        })
    })
})


describe("Event Booking Api of bookings", () => {

    //Test Get
    describe("GET All bookings", () => {
        it("It should return a list of bookings", (done) => {
            chai.request(server)
                .get("/api/users")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('status');
                    response.body.should.have.property('data')
                    done();
                })
        })
    })
})