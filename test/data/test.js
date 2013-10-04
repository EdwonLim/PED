PED.register('test.config', function($p, $e, $d) {

    $d.define('test.data', true);

});

PED.register('test.data.data1', function($p, $e, $d) {

    var data = {
        a : 1,
        b : 2,
        c : 3
    };

    $d.calc('test.data', function() {
        return data;
    });

});

PED.register('test.data.data2', function($p, $e, $d) {

    var data = {
        c : 4,
        d : 5,
        e : 6
    };

    $d.calc('test.data', function() {
        return data;
    });

});

PED.register('test.data.test', function($p, $e, $d) {

    console.log($d.value('test.data'));

});