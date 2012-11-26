var socket = io.connect(window.location.hostname)
    , h2
    , resultado
    , ano
    , consulta
    ;

socket.on('200', function (data) {
    h2.empty().html(data.msg).show();
    resultado.find('li.js-city p:eq(0)').html( parseConsulta(data.resultado.cidade || 'Não há informação.') );
    resultado.find('li.js-car p:eq(0)').html( parseConsulta(data.resultado.carro || 'Não há informação.') );
    resultado.find('div.msg span.js-ano').html( ano.val() );
    resultado.slideDown();
    ano.val('');
});

socket.on('500', function (data) {
    h2.empty().html(data.err).show();
    resultado.slideUp();
    ano.val('');
});

// jQuery document ready
jQuery.fn.ready(function(){

    // jQuery as $
    (function($){

        h2 = $('h2#msg');
        h2.hide();

        resultado = $('div#resultado');
        resultado.hide();

        consulta = $('#consulta');
        ano = $('#ano');

        ano.on('keyup',function(e){
            if(e.which == 13)
                consulta.trigger('click');
        });

        consulta.on('click',function(){
            socket.emit('click:consulta',{ "ano": ano.val()});
        });
        
    })(jQuery);
});

function parseConsulta(s)
{
    var patt = /Fonte: ([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/g
    return s.replace(patt, '<br>Fonte: <a href="$1" target="_blank">$1</a>');
}
