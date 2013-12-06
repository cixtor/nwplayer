
/**
 * NWPlayer
 * http://cixtor.com/
 * https://github.com/cixtor/nwplayer
 *
 * Desktop and web application to watch videos from major websites and saving
 * the history in a local database. Check the history, video information, related
 * videos, playlists, avoid ads in the interface and take control of your stats
 * without affect your browsing.
 */

var NWPlayerLib = {
    config: {
        service: '/api',
        input_id: '#video-input',
        wrapper_id: '#nwplayer',
        content_id: '#media-content',
        loading_id: '#loading',
        iframe_id: '#video-player',
        iframe_width: 710,
        iframe_height: 440
    },

    search_video: function(){
        var instance = this;
        var query = $(instance.config.input_id).val();
        if( query!='' ){
            $.ajax({
                url: instance.config.service + '/search_video',
                type: 'POST',
                data: { query:query },
                success: function(data, textStatus, jqXHR){
                    var content = $('<div>',{ class:'search-video videolist' }).append(data);
                    $(instance.config.content_id).append(content);
                    $(instance.config.content_id+' .search-video .view-video').bind('click', function(e){
                        e.preventDefault();
                        var video_url = $(this).attr('href');
                        $(instance.config.input_id).val(video_url);
                        instance.video_play();
                    });
                }
            });
        }
    }
}

jQuery(document).ready(function(){
    $('.toolbar .btn').tooltip({ 'container':'body', 'placement':'bottom' });

    $('#search-video').on('click', NWPlayerLib.search_video);
});
