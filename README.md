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

### Installation

```shell
$ cd /opt/
$ git clone https://github.com/cixtor/nwplayer
$ cd /usr/share/applications
$ ln -s /opt/nwplayer/desktop/nwplayer.desktop
$ cd /opt/nwplayer
$ npm install
$ bash ./nwplayer
```

### License

```
The MIT License (MIT)

Copyright (c) 2013 CIXTOR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
