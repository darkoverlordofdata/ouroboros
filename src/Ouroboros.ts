import * as GLib from 'GLib'
import * as Gtk from 'Gtk'
import * as Gio from 'Gio'
import {Util} from 'Util'
import {AppWindow, IAppWindow} from 'AppWindow'

const USER_DATA_DIR = GLib.get_user_data_dir()+'/ouroboros'

const darkThemeDefault = "true"
const themeNameDefault = "elementary"
const configDefault = {
  appName: "Ouroboros",
  url: '',
  base: '',
  darkTheme: darkThemeDefault,
  themeName: themeNameDefault
}

/**
 * Ouroboros 
 *
 * top level application object
 */
export class Ouroboros {

  application: Gtk.Application
  appWindow: AppWindow
  window: IAppWindow
  path: string
  name: string

  constructor() {
    this.application = new Gtk.Application({flags: Gio.ApplicationFlags.FLAGS_NONE})
    this.application.connect('activate', () => {
        this.appWindow = new AppWindow({
          application: this.application,
        }, this)
        this.buildUI(this.application)
        this.appWindow.setConfig(this.getConfig())
        this.appWindow.buildUI()
        this.window = this.appWindow.window
        
        this.window.present()
    })
  }
  
  /**
   * build the Gio.Application Menu
   *
   * main app menu
   */
  buildUI(application) {
    let menu = new Gio.Menu()
    menu.append(_("New"), 'app.new')
    menu.append(_("About"), 'app.about')
    menu.append(_("Quit"), 'app.quit')
    application.set_app_menu(menu)

    let newAction = new Gio.SimpleAction({ name: 'new' })
    newAction.connect('activate', () => this.showNew())
    application.add_action(newAction)

    let aboutAction = new Gio.SimpleAction({ name: 'about' })
    aboutAction.connect('activate', () => this.showAbout())
    application.add_action(aboutAction)

    let quitAction = new Gio.SimpleAction({ name: 'quit' })
    quitAction.connect('activate', () => this.window.destroy())
    application.add_action(quitAction)
  }

  /**
   * New project dialog
   */
  showNew() {
    return print("Not implemented")
  }


  /**
   * About dialog
   */
  showAbout() {
    let about = new Gtk.AboutDialog()
    about.set_logo_icon_name(null)
    about.set_transient_for(this.window)
    about.set_program_name(_("Ouroboros"))
    about.set_version(_("1.0"))
    about.set_comments("By anonymous medieval illuminator;  Fol. 196 of Codex Parisinus graecus 2327, a copy (made by Theodoros Pelecanos (Pelekanos) of Corfu in Khandak, Iraklio, Crete in 1478) of a lost manuscript of an early medieval tract which was attributed to Synosius (Synesius) of Cyrene (d. 412).The text of the tract is attributed to Stephanus of Alexandria (7th century).cf.Public Domain,")
    about.set_website("https://commons.wikimedia.org/w/index.php?curid=2856329")
    about.set_website_label("source")
    about.set_authors(["bruce davidson"])
    about.run()
    return about.destroy()
  }


  /**
   * load configuration
   */
  getConfig() {

    Util.mkdir(USER_DATA_DIR)
    let data = Util.readFile(USER_DATA_DIR + '/config.json')
    let isNew = data == null 
    let config = isNew ? configDefault : JSON.parse(data)
    if (isNew) this.setConfig(config)

    let gtkSettings = Gtk.Settings.get_default()
    gtkSettings.gtk_application_prefer_dark_theme = config.darkTheme === 'true'
    gtkSettings.gtk_theme_name = config.themeName
    return config
  }

  /**`
   * setConfig
   * 
   * @config new values
   */
  setConfig(config) {
      Util.writeFile(USER_DATA_DIR + '/config.json', JSON.stringify(config, null, 2))
  }

  /**
   * setConfigValue
   * 
   * @name property name
   * @value new value
   */
  setConfigValue(name: string, value: string) {
    if (value === "") return
    let data = Util.readFile(USER_DATA_DIR + '/config.json')
    let config = data == null ? configDefault : JSON.parse(data)
    if (config[name] === value) return
    let gtkSettings = Gtk.Settings.get_default()
    switch(name) {

      case 'base': 
        config[name] = value
        this.setConfig(config)
        this.appWindow.setConfig(config)
        break
      
      case 'url': 
        config[name] = value
        this.setConfig(config)
        this.appWindow.setConfig(config)
        break

      case 'darkTheme':
        gtkSettings.gtk_application_prefer_dark_theme = value === 'true'
        config[name] = value
        this.setConfig(config)
        this.appWindow.setConfig(config)
        break

      case 'themeName':
        gtkSettings.gtk_theme_name = value
        config[name] = value
        this.setConfig(config)
        this.appWindow.setConfig(config)
        break

    }
  }
}
