# NWPlayer

Cross-platform desktop application to watch videos from different websites including YouTube, Video, Dailymotion, among others. The application was built on top of [node-webkit](https://github.com/nwjs/nw.js) with an embedded web server written in Node.js _(originally written in Ruby with the Sinatra framework)_. The metadata is stored in a local database powered by SQLite.

## Installation

```sh
git clone "https://github.com/cixtor/nwplayer" /opt/nwplayer
cd /opt/nwplayer || exit
npm install
cd ~/.local/share/applications/
ln -s /opt/nwplayer/desktop/nwplayer.desktop
bash /opt/nwplayer/nwplayer
```

![NWPlayer Screenshot](http://cixtor.com/uploads/nwplayer-screenshot-0.png)

## Features

* Video description and thumbnails.
* Video history including a way to search by title and video id.
* Display related videos (YouTube support only).
* Display videos from a Playlist (YouTube support only).
* Search videos remotely (YouTube support only)
* Play random videos from YouTube and Vimeo.
