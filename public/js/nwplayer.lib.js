
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
        iframe_width: 700,
        iframe_height: 430
    },

    video_play: function(){
        var data;
        var instance = NWPlayerLib;
        var video_url = $(instance.config.input_id).val();
        if( video_url!='' ){
            if( data = instance.vkcom_video(video_url) ){
                instance.create_iframe(data);
            }else{
                $.ajax({
                    url: instance.config.service + '/video_play',
                    type: 'POST',
                    dataType: 'json',
                    data: { video_id:video_url },
                    success: function(data, textStatus, jqXHR){
                        if( data.status == 1 ){
                            instance.create_iframe(data.video);
                        }else{
                            alert('Error '+data.code+': '+data.message);
                        }
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

    create_iframe: function(data){
        var instance = NWPlayerLib;
        var config = instance.config;
        var content_children = $(config.content_id).children();
        var iframe = $('<iframe>',{
            'id': config.iframe_id,
            'width': config.iframe_width,
            'height': config.iframe_height,
            'src': data.embed,
            'frameborder': 0
        });
        $(config.input_id).val(data.url);
        if( content_children.length > 0 ){
            content_children.before(iframe);
        }else{
            $(config.content_id).html(iframe);
        }
        $(config.content_id+'>.metadata .video-image').html( $('<img>',{ src:data.image }) );
        $(config.content_id+'>.metadata .video-information .title').html(data.title);
        // $(config.content_id+'>.metadata .video-information .duration .value').html(data.duration/60);
        $(config.content_id+'>.metadata .video-information blockquote>p').html(data.description);
        $(config.content_id+'>.metadata .video-information blockquote>small').html( $('<a>',{href:data.url}).html(data.url) );
    },

    draw_result_search: function(data){
        var instance = NWPlayerLib;
        $(instance.config.content_id).append(data);
        $(instance.config.content_id+' .search-video .view-video').bind('click', function(e){
            e.preventDefault();
            var video_url = $(this).attr('href');
            $(instance.config.input_id).val(video_url);
            instance.video_play();
        });
    },

    search_video: function(){
        var instance = NWPlayerLib;
        var query = $(instance.config.input_id).val();
        if( query!='' ){
            $.ajax({
                url: instance.config.service + '/search_video',
                type: 'POST',
                dataType: 'html',
                data: { query:query },
                success: function(data, textStatus, jqXHR){
                    instance.draw_result_search(data);
                }
            });
        }
    },

    related_video: function(){
        var instance = NWPlayerLib;
        var video_url = $(instance.config.input_id).val();
        if( video_url!='' ){
            $.ajax({
                url: instance.config.service + '/related_video',
                type: 'POST',
                data:{ video_id:video_url },
                success: function(data, textStatus, jqXHR){
                    instance.draw_result_search(data);
                }
            });
        }
    },

    video_playlist: function(){
        var instance = NWPlayerLib;
        var video_url = $(instance.config.input_id).val();
        if( video_url!='' ){
            $.ajax({
                url: instance.config.service + '/video_playlist',
                type: 'POST',
                data:{ video_id:video_url },
                success: function(data, textStatus, jqXHR){
                    instance.draw_result_search(data);
                }
            });
        }
    },

    db_history: function(){
        var instance = NWPlayerLib;
        var query = $(instance.config.input_id).val();
        $(instance.config.content_id).html('');
        $.ajax({
            url: instance.config.service + '/db_history',
            type: 'POST',
            dataType: 'html',
            data:{ query:query },
            success: function(data, textStatus, jqXHR){
                $(instance.config.content_id).html(data);
                $(instance.config.content_id+' td > a').bind('click', function(e){
                    e.preventDefault();
                    var video_url = $(this).attr('href');
                    $(instance.config.input_id).val(video_url);
                    NWPlayerLib.video_play();
                });
            }
        });
    },

    video_refresh: function(){
        var instance = NWPlayerLib;
        var current_url = $(instance.config.iframe_id).attr('src');
        if( current_url === undefined ){
            var iframe = $('<iframe>',{
                'id':     instance.config.iframe_id,
                'width':  instance.config.iframe_width,
                'height': instance.config.iframe_height,
                'src':    $(instance.config.input_id).val(),
                'frameborder': 0
            });
            $(instance.config.content_id).html(iframe);
        }else{
            $(instance.config.input_id).val('Reloading...');
            $(instance.config.iframe_id).attr('src', current_url);
            setTimeout(function(){ $(instance.config.input_id).val(current_url) }, 1000);
        }
    }
}

jQuery(document).ready(function(){
    $('.toolbar .btn').tooltip({ 'container':'body', 'placement':'bottom' });

    $('#search-video').on('click', NWPlayerLib.search_video);
    $('#db-history').on('click', NWPlayerLib.db_history);
    $('#video-play').on('click', NWPlayerLib.video_play);
    $('#video-playlist').on('click', NWPlayerLib.video_playlist);
    $('#video-related').on('click', NWPlayerLib.related_video);
    $('#video-refresh').on('click', NWPlayerLib.video_refresh);
}).ajaxStart(function(){
    $(NWPlayerLib.config.input_id).addClass('loading');
}).ajaxComplete(function(){
    $(NWPlayerLib.config.input_id).removeClass('loading');
});
