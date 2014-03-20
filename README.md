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
Copyright (c) 2013, CIXTOR
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list
of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this
list of conditions and the following disclaimer in the documentation and/or other
materials provided with the distribution.
Neither the name of the CIXTOR NWPLAYER nor the names of its contributors may be
used to endorse or promote products derived from this software without specific
prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
OF THE POSSIBILITY OF SUCH DAMAGE.
```
