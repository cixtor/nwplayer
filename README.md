# NWPlayer

Desktop and web application to watch videos from major websites and saving the history in a local database. Check the history, video information, related videos, playlists, avoid ads in the interface and take control of your stats without affect your browsing.

It was initially developed on top of [Sinatra](http://www.sinatrarb.com) and rewritten into [Node.JS](http://nodejs.org/) and [Sqlite3](https://github.com/mapbox/node-sqlite3) to improve the performance. **WARNING** the code is still being rewritten, so the functionality that you will find here has not the 100% of tools available in the _ruby_ based version.

### Features

* Video stream using regular expressions to autodetect the appropiate video player to display.
* Video description and thumbnail on video streaming.
* Video reload (without database manipulation) on video streaming errors.
* History and views storing, including a way to search through the history by title and video_id.
* Display related videos (Youtube support only).
* Display videos from a Playlist (Youtube support only).

### Developers Guide JSON

An increasingly popular alternative to XML is JSON (JavaScript Object Notation). It is a
simplistic text-based format that is designed to be human readable. Unlike XML, it has no
notion of namespaces and can only represent data in the format of associative arrays.
All Data APIs support JSON output through the use of the alt parameter. For example, you
can retrieve the current most popular videos from YouTube in JSON format as follows:

```
http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json
```

<small>Reference: [Developers Guide JSON](https://developers.google.com/youtube/2.0/developers_guide_json)</small>

### Developers Guide JSON-C

When submitting a YouTube Data API request, you can use the alt query parameter to specify
the format of the API response. The API can return responses in a number of formats, including
Atom (XML), RSS (XML), JSON (JavaScript Object Notation) and JSON-C, which is a variant of JSON.
This document describes the JSON-C response format, which is designed to allow developers a
basic level of API access to API responses from JavaScript and other clients.

<small>Reference: [Developers Guide JSON-C](https://developers.google.com/youtube/2.0/developers_guide_jsonc)</small>

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
