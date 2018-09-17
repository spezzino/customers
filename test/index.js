import sinon from 'sinon';
import chai from 'chai';

const expect = chai.expect;

import { getUsers } from '../routes/usersFunctions';
import User from '../models/User';

describe("Get all users", () => {
  it("should return all users", (done) => {
    const UserMock = sinon.mock(User);
    const expectedResult = { items: [] };
    UserMock.expects('find').yields(null, expectedResult);
    User.find((err, result) => {
      console.log(result)
      UserMock.verify();
      UserMock.restore();
      expect(result.items).to.be.empty;
      done();
    });
  });

  it("should return error", (done) => {
    var UserMock = sinon.mock(User);
    var expectedResult = { status: false, error: "Something went wrong" };
    UserMock.expects('find').yields(expectedResult, null);
    User.find(function (err, result) {
      UserMock.verify();
      UserMock.restore();
      expect(err.status).to.not.be.true;
      done();
    });
  });
});
