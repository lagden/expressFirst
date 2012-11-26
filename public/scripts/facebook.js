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
            , name: 'Lagden App'
            , link: 'http://whispering-island-5758.herokuapp.com'
            , picture: 'http://www.gravatar.com/avatar/bfe5ce4cb209f3e4f4584e1f5aa209c6.png'
            , caption: 'Yeahhh!!'
            , description: 'Isto é apenas um teste!'
            , message: ''
        });
    });

})(jQuery);