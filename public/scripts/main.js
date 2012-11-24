var socket = io.connect(window.location.hostname);

socket.on('200', function (data) {
    console.log(data);
});

socket.on('500', function (data) {
    console.log(data);
});

// jQuery document ready
jQuery.fn.ready(function(){

    // jQuery as $
    (function($){

        var consulta = $('#consulta')
            , ano = $('#ano')
            ;

        ano.on('keyup',function(e){
            if(e.which == 13)
                consulta.trigger('click');
        });

        consulta.on('click',function(){
            socket.emit('click:consulta',{ "ano": ano.val()});
        });
        
    })(jQuery);
});