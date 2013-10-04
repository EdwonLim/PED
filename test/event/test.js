PED.register('test.event.config', function($p, $e, $d) {
    $e.define('test.event');
});

PED.register('test.event.moduleA', function($p, $e, $d) {

    $e.beforeEvent('test.event', function(e, data) {
        console.log('Before', e, data);
//        e.stopEvent();
//        setTimeout(function(){
//            e.release();
//        }, 1000);
    });

});

PED.register('test.event.moduleB', function($p, $e, $d) {

    $e.addEventListener('test.event', function(e, data) {
        console.log('Add1', e, data);
    });

});

PED.register('test.event.moduleC', function($p, $e, $d) {

    $e.addEventListener('test.event', function(e, data) {
        console.log('Add2', e, data);
    });

});

PED.register('test.event.moduleD', function($p, $e, $d) {

    $e.afterEvent('test.event', function(e, data) {
        console.log('After', e, data);
    });

});

PED.register('test.event.test', function($p, $e, $d) {

    $e.fireEvent('test.event', {test : 'This is a test data'});

});