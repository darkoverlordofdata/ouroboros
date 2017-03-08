import * as Gtk from 'Gtk'
import * as Gio from 'Gio'
import * as Liquid from 'Liquid'
import * as WebKit from 'WebKit'
import * as Joy from 'joy/Joy'
import {View} from 'joy/View'
import {Static} from 'joy/Static'
import {Util} from 'Util'

const DATADIR = '/home/bruce/gjs/ouroboros'
/**
 * Routes
 */
const routes = [{
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply.redirect('app.html')
    }
},{ 
    method: 'GET',
    path: '/*',
    handler: function(request, reply) {
        reply.file(request.path)
    }
}]

Gtk.init(null)
const application = new Gtk.Application({application_id: 'com.darkoverlordofdata.ouroboros', flags: Gio.ApplicationFlags.FLAGS_NONE})
const server = new Joy.Server()
Gtk.Window.set_default_icon_from_file(`${DATADIR}/share/ouroboros/bosco.png`)

server.connection({
    port: 8088, 
    host: '0.0.0.0'
})
server.route(routes)
server.register([ 
    /**
     * plugins:
     */
    {register: Static,  options: {base: `${DATADIR}/src/web`} }, 
    {register: View,    options: {} }
], (err) => {
    if (err) throw err
    
    /** 
     * initialize the templating engine 
     */
    server.views({  
        path: `${DATADIR}/src/views`,
        engines: {
            liquid: (src, data={}) => Liquid.Template.parse(src).render(data) 
        }
    })
    
    /** 
     * start the server 
     */
    application.connect('activate', () => {
        let err = server.start()
        if (err) throw err
        let gtkSettings = Gtk.Settings.get_default()
        gtkSettings.gtk_application_prefer_dark_theme = true

        let webView = new WebKit.WebView()
        let scrollWindow = new Gtk.ScrolledWindow({})
        let vbox = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL})
        scrollWindow.add(webView)
        vbox.pack_start(scrollWindow, true, true, 0)

        let window = new Gtk.Window({
            title: 'Orobouros',
            type : Gtk.WindowType.TOPLEVEL,
            window_position: Gtk.WindowPosition.CENTER
        })
        // configure client window
        window.set_default_size(1024, 720)
        window.set_resizable(true)
        window.connect('destroy', () => Gtk.main_quit())
        window.connect('delete_event', () => false)
        window.add(vbox)
        window.show_all()
        // print(`Server running at: http://${server.info.host}:${server.info.port}/`)
        webView.load_uri(`http://${server.info.host}:${server.info.port}/`)
    })
    application.run(null)
})

Gtk.main()


  /**
   * build the Gio.Application Menu
   *
   * main app menu
   */
  function buildMenuUI(application) {
    let menu = new Gio.Menu()
    menu.append(_("New"), 'app.new')
    menu.append(_("About"), 'app.about')
    menu.append(_("Quit"), 'app.quit')

    application.set_app_menu(menu)
    let newAction = new Gio.SimpleAction({
      name: 'new'
    })

    newAction.connect('activate', () => {
      //return this.showNew()
    })

    application.add_action(newAction)
    let aboutAction = new Gio.SimpleAction({
      name: 'about'
    })

    aboutAction.connect('activate', () => {
      //return this.showAbout()
    })

    application.add_action(aboutAction)
    let quitAction = new Gio.SimpleAction({
      name: 'quit'
    })

    quitAction.connect('activate', () => {
      //return this.window.destroy()
    })

    application.add_action(quitAction)
  }
