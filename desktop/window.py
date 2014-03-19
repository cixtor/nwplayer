#!/usr/bin/env python
#
# NWPlayer
# http://cixtor.com/
# https://github.com/cixtor/nwplayer
#
# Desktop and web application to watch videos from major websites and saving
# the history in a local database. Check the history, video information, related
# videos, playlists, avoid ads in the interface and take control of your stats
# without affect your browsing.
#
from os import path
import gtk
import webkit

class NWPlayer:
    def get_resource_path(self, rel_path):
        dir_of_py_file = path.dirname(__file__)
        rel_path_to_resource = path.join(dir_of_py_file, rel_path)
        abs_path_to_resource = path.abspath(rel_path_to_resource)
        return abs_path_to_resource

    def destroy(self, widget, data=None):
        gtk.main_quit()

    def __init__(self):
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.browser = webkit.WebView()
        self.scrollbar = gtk.ScrolledWindow()

        self.window.resize(702, 488)
        self.window.set_title('NWPlayer @ Cixtor.com')
        self.window.connect('destroy', self.destroy)
        self.window.set_icon_from_file(self.get_resource_path('nwplayer-icon.png'))

        self.scrollbar.add(self.browser)
        self.window.add(self.scrollbar)
        self.browser.open('http://localhost:3000/')
        self.window.show_all()
        gtk.main()

if __name__ == '__main__':
    nwplayer = NWPlayer()
