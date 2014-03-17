
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
        video_metadata: '#videolist-metadata',
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
                        if( instance.is_json_error(data) ){
                            instance.draw_alert(data);
                        }else{
                            instance.create_iframe(data.video);
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
        instance.draw_metadata(data);
    },

    draw_metadata: function(data){
        var instance = NWPlayerLib;
        var metadata_div_id = instance.config.video_metadata.replace('#','');
        $(instance.config.content_id+'>iframe').before(
            $('<div>',{ 'class':'search-video videolist hidden', 'id':metadata_div_id }).html(
                $('<ul>',{ 'class':'thumbnails' }).html(
                    $('<li>',{ 'class':'video-item clearfix' }).append(
                        $('<div>',{ 'class':'thumbnail pull-left' }).append(
                            $('<a>',{ 'href':data.url, 'class':'view-video' }).html(
                                $('<img>',{ 'src':data.image })
                            )
                        ).append(
                            $('<span>',{ 'class':'duration' }).html(data.duration)
                        )
                    ).append(
                        $('<div>',{ 'class':'pull-right information' }).append(
                            $('<a>',{ 'href':data.url, 'class':'view-video video-title' }).html(data.title)
                        ).append(
                            $('<ul>',{ 'class':'metadata' }).html('')
                        ).append(
                            $('<p>').html(data.description)
                        )
                    )
                )
            )
        );
    },

    is_json_error: function(data){
        if( data.status != undefined && data.status == 0 ){ return true }
        else{ return false }
    },

    draw_alert: function(data){
        var instance = NWPlayerLib;

        if( data.code == undefined ){ data.code = 500 }
        if( data.message == undefined ){ data.message = 'Internal Server Error' }

        var d = $('<div>', { 'class':'alert alert-danger' });
        var a = $('<a>', { 'class':'close', 'data-dismiss':'alert', 'href':'#', 'aria-hidden':'true' }).html('&times;');
        var p = $('<p>').html( '<strong>Error '+data.code+'. </strong>'+data.message );

        var alert = d.append(a).append(p);
        $(instance.config.content_id).append(alert);
    },

    draw_result_search: function(data){
        var instance = NWPlayerLib;

        if( instance.is_json_error(data) ){
            instance.draw_alert(data);
        }

        else{
            $(instance.config.content_id).append(data);
            $(instance.config.content_id+' .search-video .view-video').bind('click', function(e){
                e.preventDefault();
                var video_url = $(this).attr('href');
                $(instance.config.input_id).val(video_url);
                instance.video_play();
            });
        }
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

        $.ajax({
            url: instance.config.service + '/db_history',
            type: 'POST',
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
    },

    reset_media_content: function(){
        var instance = NWPlayerLib;
        var containers = [ '.alert', '.videolist', '.dbhistory', 'iframe' ];

        for( var i in containers ){
            var container_class = containers[i];
            $(instance.config.content_id+'>'+container_class).remove();
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
    $('#video-metadata').on('click', function(){
        var metadata_div =  $(NWPlayerLib.config.video_metadata);
        var is_hidden = metadata_div.hasClass('hidden');
        if( is_hidden ){
            metadata_div.removeClass('hidden');
        } else {
            metadata_div.addClass('hidden');
        }
    });
}).ajaxStart(function(){
    $(NWPlayerLib.config.input_id).addClass('loading');
    NWPlayerLib.reset_media_content();
}).ajaxComplete(function(){
    $(NWPlayerLib.config.input_id).removeClass('loading').focus();
});
