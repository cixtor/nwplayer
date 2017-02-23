# NWPlayer

Desktop and web application to watch videos from major websites and saving the history in a local database. Check the history, video information, related videos, playlists, avoid ads in the interface and take control of your stats without affect your browsing.

It was initially developed on top of [Sinatra](http://www.sinatrarb.com) and rewritten into [Node.JS](http://nodejs.org/) and [Sqlite3](https://github.com/mapbox/node-sqlite3) to improve the performance. The goal is to have this application running over a [Node-Webkit](https://github.com/rogerwang/node-webkit) instance, but while the support for _SQLite_ is finished the application will run in a browser through this _URL_ [LocalHost 3000](http://localhost:3000/) and optionally through a mini-browser powered by _Python_, _GTK_ and _Webkit_.

![NWPlayer Screenshot](http://cixtor.com/uploads/nwplayer-screenshot-0.png)

### Features

* Video description and thumbnails.
* Video reload (without database manipulation) for video streaming errors.
* Video history including a way to search in the database by title and video id.
* Display related videos (YouTube support only).
* Display videos from a Playlist (YouTube support only).
* Search videos remotely (YouTube support only)
* Play random videos from YouTube and Vimeo.

### Installation

```shell
$ wget -c https://github.com/cixtor/nwplayer/archive/master.zip
$ unzip master.zip && mv -v nwplayer-master /opt/nwplayer
$ cd /opt/nwplayer && npm install
$ cd ~/.local/share/applications/
$ ln -s /opt/nwplayer/desktop/nwplayer.desktop
$ bash /opt/nwplayer/nwplayer
```
