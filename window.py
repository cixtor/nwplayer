#!/usr/bin/env python
import os
import gtk
import webkit

class NWPlayer:
    def destroy(self, widget, data=None):
        gtk.main_quit()

    def __init__(self):
        print "NWPlayer -- Python web wrapper"
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.browser = webkit.WebView()
        self.scrollbar = gtk.ScrolledWindow()

        self.window.resize(702, 488)
        self.window.set_title('NWPlayer @ Cixtor.com')
        self.window.connect('destroy', self.destroy)

        self.scrollbar.add(self.browser)
        self.window.add(self.scrollbar)
        self.browser.open('http://localhost:3000/')
        self.window.show_all()
        gtk.main()

if __name__ == "__main__":
    nwplayer = NWPlayer()
