
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

    video_play: function(){
        var data;
        var instance = this;
        var video_url = $(instance.config.input_id).val();
        if( video_url!='' ){
            if( data = instance.vkcom_video(video_url) ){
                instance.create_iframe_object(data);
            }else{
                $.ajax({
                    url: instance.config.service + '/video_play',
                    type: 'POST',
                    dataType: 'json',
                    data: { video_identifier:video_url },
                    success: function(data, textStatus, jqXHR){
                        create_iframe_object(data);
                    }
                });
            }
        }
    },

    vkcom_video: function(string){
        var data = false;
        var regex = /vk\.com\/video_ext\.php\?oid=(\d+)(&amp;|&)id=(\d+)(&amp;|&)hash=([a-z0-9]+)/;
        var match = string.match(regex);
        if( match!=null ){
            var data = {
                is_vkcom_video: true,
                oid: match[1],
                id: match[3],
                hash: match[5]
            };
            data.embed = 'http://vk.com/video_ext.php?oid='+data.oid+'&id='+data.id+'&hash='+data.hash+'&hd=1';
            data.url = data.embed;
        }
        return data;
    },

    search_video: function(){
        var instance = NWPlayerLib;
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
