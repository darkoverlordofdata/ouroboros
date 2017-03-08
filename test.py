#!/usr/bin/python 
# -*- coding: utf-8 -*- 
## Here we imported both Gtk library and the WebKit engine. 
from gi.repository import Gtk, WebKit 
class Handler: 
def backbutton_clicked(self, button): 
## When the user clicks on the Back button, the '.go_back()' method is activated, which will send the user to the previous page automatically, this method is part from the WebKit engine. 
browserholder.go_back() 
def refreshbutton_clicked(self, button): 
## Same thing here, the '.reload()' method is activated when the 'Refresh' button is clicked. 
browserholder.reload() 
def enterkey_clicked(self, button): 
## To load the URL automatically when the "Enter" key is hit from the keyboard while focusing on the entry box, we have to use the '.load_uri()' method and grab the URL from the entry box. 
browserholder.load_uri(urlentry.get_text()) 
## Nothing new here.. We just imported the 'ui.glade' file. 
builder = Gtk.Builder() 
builder.add_from_file("ui.glade") 
builder.connect_signals(Handler()) 
window = builder.get_object("window1") 
## Here's the new part.. We created a global object called 'browserholder' which will contain the WebKit rendering engine, and we set it to 'WebKit.WebView()' which is the default thing to do if you want to add a WebKit engine to your program. 
browserholder = WebKit.WebView() 
## To disallow editing the webpage. 
browserholder.set_editable(False) 
## The default URL to be loaded, we used the 'load_uri()' method. 
browserholder.load_uri("http://tecmint.com") 
urlentry = builder.get_object("entry1") 
urlentry.set_text("http://tecmint.com") 
## Here we imported the scrolledwindow1 object from the ui.glade file. 
scrolled_window = builder.get_object("scrolledwindow1") 
## We used the '.add()' method to add the 'browserholder' object to the scrolled window, which contains our WebKit browser. 
scrolled_window.add(browserholder) 
## And finally, we showed the 'browserholder' object using the '.show()' method. 
browserholder.show() 
## Give that developer a cookie ! 
window.connect("delete-event", Gtk.main_quit) 
window.show_all() 
Gtk.main()
