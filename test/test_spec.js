"use strict";

var Calculator = function Calculator() {
  return {
    add:function add(firstNum, secondNum) {
      return firstNum + secondNum;
    }
  };
};

describe("Calculator", function () {
  var calculator;
  beforeEach(function (){
    calculator = new Calculator();
  });

  describe("add()", function () {
    it("adds two numbers together", function () {
      var numOne = 2;
      var numTwo = 6;
      var expectedResult = 8;

      var actualResult = calculator.add(numOne, numTwo);

      expect(actualResult).toEqual(expectedResult);
    });
  });
});


describe("Super Async", function () {
  var calculator;
  beforeEach(function (){
    calculator = 1 + 1;
  });

  describe("async add)", function () {
    it("adds two numbers together", function (done) {
      setTimeout(function() {
        expect(calculator).toEqual(2);
        done();
      }, 10000)
    });
  });
});
