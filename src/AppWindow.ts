import * as GLib from 'GLib'
import * as Gtk from 'Gtk'
import * as Gio from 'Gio'
import * as WebKit from 'WebKit'
import * as Liquid from 'Liquid'
import * as Joy from 'joy/Joy'
import {Util} from 'Util'
import {View} from 'joy/View'
import {Static} from 'joy/Static'
import {Ouroboros} from 'Ouroboros'

const DATADIR = '/home/bruce/gjs/ouroboros'
const THEMES = [
  "elementary",
  "Adwaita"
]

/**
 * Factory returns an anonymous implemention of the IAppWindow interface
 */
function AppWindowFactory() {
  return Util.loadTemplate({
    name: 'AppWindow', 
    extends: Gtk.ApplicationWindow,
    fields: ['background', 'back', 'refresh', 'url', 'scrolled', 'status'],
    path: `${DATADIR}/share/ouroboros/main.ui`
  })
}

/** 
 * IAppWindow interface exposes fields from the designer in
 * Ouroboros.ui 
 */
export interface IAppWindow extends Gtk.ApplicationWindow {
  background: Gtk.Box
  back: Gtk.Button
  refresh: Gtk.Button
  url: Gtk.Entry
  scrolled: Gtk.ScrolledWindow
  status: Gtk.Statusbar
}

/**
 * Top level Application
 */
export class AppWindow {
  config: any     /* config hash*/
  window: IAppWindow
  headerbar: Gtk.HeaderBar
  parent: Ouroboros
  server: Joy.Server
  webView: WebKit.WebView

  /**
   * Load the glade template
   */
  constructor(params, parent) {
    this.parent = parent
    this.window = new (AppWindowFactory())(params) as IAppWindow
    Gtk.Window.set_default_icon_from_file(`${DATADIR}/share/ouroboros/bosco.png`)
  }

  setConfig(config) {
    this.config = config
  }
  /**
   * buildUI
   *   
   * @param config
   */
  buildUI() {
    this.headerbar = new Gtk.HeaderBar({
      title: this.config.appName,
      show_close_button: true
    })
    this.headerbar.pack_start(this.buildOpen())
    this.headerbar.pack_start(this.buildPreferences())

    let webView = this.webView = new WebKit.WebView()
    this.window.scrolled.add(this.webView)
    this.window.back.connect('clicked', (button) => webView.go_back() )
    this.window.refresh.connect('clicked', (button) => webView.reload() )
    this.window.url.connect('activate', (button) => webView.load_uri(this.window.url.get_text()))

    this.server = new Joy.Server()
    this.startServer(this.server)
    this.window.set_default_size(1040, 740)
    this.window.set_titlebar(this.headerbar)
    return this.window.show_all()
  }

  setUrl(url: string) {
    this.webView.load_uri(url)
    this.window.url.set_text(url)
    
  }

  buildPreferences() {

    // Add options to set the name and the prefix
    let grid = new Gtk.Grid({
        column_spacing: 10,
        row_spacing: 10,
        margin: 10
    })

    grid.set_column_homogeneous(true)

    let darkLabel = new Gtk.Label({ label: "Dark theme:" })
    darkLabel.set_halign(Gtk.Align.END)

    let darkEntry = new Gtk.Switch({
      state: this.config.darkTheme === 'true', 
      valign: Gtk.Align.CENTER
    })
    darkEntry.connect('state-set', () => this.parent.setConfigValue('darkTheme', darkEntry.get_active().toString()))

    grid.attach(darkLabel, 0, 0, 1, 1)
    grid.attach_next_to(darkEntry, darkLabel, Gtk.PositionType.RIGHT, 2, 1)

    let themeLabel = new Gtk.Label({label: "Theme name:"})
    themeLabel.set_halign(Gtk.Align.END)

    let themeSelect = new Gtk.ComboBoxText()
    THEMES.forEach((theme, i) => themeSelect.insert(i, theme, theme))
    themeSelect.set_active_id(this.config.themeName)
    themeSelect.connect('changed', () => this.parent.setConfigValue('themeName', themeSelect.get_active_text()))

    grid.attach(themeLabel, 0, 1, 1, 1)
    grid.attach_next_to(themeSelect, themeLabel, Gtk.PositionType.RIGHT, 2, 1)

    let menubutton = new Gtk.ToggleButton()
    menubutton.add(new Gtk.Image({
      icon_name: "open-menu-symbolic",
      icon_size: Gtk.IconSize.SMALL_TOOLBAR
    }))

    let menu = new Gtk.Popover()
    menu.set_relative_to(menubutton)
    menu.connect("closed", () => menubutton.get_active() ? menubutton.set_active(false) : null)
    menubutton.connect("clicked", () => menubutton.get_active() ? menu.show_all() : null)
    menu.add(grid)
    return menubutton
  }

  /**
   * build open site button
   *   
   * @param config
   */
  buildOpen() {
    const openButton = new Gtk.Button()
    openButton.add(new Gtk.Image({
      icon_name: "document-open-symbolic",
      icon_size: Gtk.IconSize.SMALL_TOOLBAR
    }))
    openButton.connect("clicked", () => {
        const chooser = new Gtk.FileChooserDialog({
          title: _("Select Project File"),
          action: Gtk.FileChooserAction.OPEN,
          transient_for: this.window,
          modal: true
        })
        chooser.set_select_multiple(false)
        chooser.add_button(_("Open"), Gtk.ResponseType.OK)
        chooser.add_button(_("Cancel"), Gtk.ResponseType.CANCEL)
        chooser.set_default_response(Gtk.ResponseType.OK)
        chooser.connect("response", (dialog, response) => {
        //   this.projectPath = dialog.get_filenames()[0]
        //   dialog.destroy()
        //   return this.displayProject(this.projectPath)
        })
        return chooser.run()
    })
    return openButton
  }

  startServer(server) {
    server.connection({
        port: 8088, 
        host: '0.0.0.0'
    })
    server.route([{
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
      }])
    server.register([ 
        /**
         * plugins:
         */
        {register: Static,  options: {base: `${DATADIR}/src/web`} }, 
        {register: View,    options: {} }
    ], (e) => {
        if (e) throw e
        
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
          let err = server.start()
          if (err) throw err
          this.setUrl(`http://${server.info.host}:${server.info.port}/`)
    })

    
  }

}

