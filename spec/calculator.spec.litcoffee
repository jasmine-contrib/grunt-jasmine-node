Calculator test
===============

First a Calculator class is declared which defines the add method

    class Calculator
      constructor: () ->

      add: (val1,val2) ->
        return val1 + val2

Before each test a new Calculator instance is created

    describe 'Calculator litcoffee', ->
        calculator = {}

        beforeEach () ->
            calculator = new Calculator()
            return

The only expection to the add method is that it adds those 2 values

        describe 'add()',  ->
            it 'adds two numbers together', ->
                val1 = 2
                val2 = 6
                expectedResult = 8
                actualResult = calculator.add(val1,val2)

                expect(actualResult).toEqual(expectedResult);
