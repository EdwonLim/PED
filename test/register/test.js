PED.register('test.register.ClassA', function() {

    var ClassA = function() {
        this.name = 'ClassA';
    };

    ClassA.prototype = {
        getName : function() {
            return this.name;
        }
    };

    return ClassA;
});

PED.register('test.register.ClassB', function() {

    var ClassB = function() {
        this.name = 'ClassB';
    };

    ClassB.prototype = {
        getName : function() {
            return this.name;
        }
    };

    return ClassB;
});

PED.register('test.register.test', function($p) {

    var classA = new $p.test.register.ClassA(),
        classB = new $p.test.register.ClassB();

    console.log(classA.getName());
    console.log(classB.getName());
});