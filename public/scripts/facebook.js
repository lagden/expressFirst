(function($){
    // Set up so we handle click on the buttons
    $('#postToWall').click(function() {
        FB.ui(
            {
                method : 'feed',
                link   : $(this).attr('data-url')
            },
            function (response) {
                // If response is null the user canceled the dialog
                if (response != null) {
                    logResponse(response);
                }
            }
        );
    });

    $('#sendToFriends').click(function() {
        FB.ui(
            {
                method : 'send',
                link   : $(this).attr('data-url')
            },
            function (response) {
                // If response is null the user canceled the dialog
                if (response != null) {
                    logResponse(response);
                }
            }
        );
    });

    $('#sendRequest').click(function() {
        FB.ui(
            {
                method  : 'apprequests',
                message : $(this).attr('data-message')
            },
            function (response) {
                // If response is null the user canceled the dialog
                if (response != null) {
                    logResponse(response);
                }
            }
        );
    });

    $('#share_button').live('click', function(e){
        e.preventDefault();
        FB.ui({
            method: 'feed'
            , name: 'HyperArts Blog'
            , link: 'http://hyperarts.com/blog'
            , picture: 'http://www.hyperarts.com/_img/TabPress-LOGO-Home.png'
            , caption: 'I love HyperArts tutorials'
            , description: 'The HyperArts Blog provides tutorials for all things Facebook'
            , message: ''
        });
    });
    
})(jQuery);