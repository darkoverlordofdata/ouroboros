
import * as Gio from 'Gio'
import * as Lang from 'Lang'

export class Util {

  static readFile(filename: string) {
    const file = Gio.file_new_for_path(filename)
    if (file.query_exists(null)) {
      let [success, data, length] = file.load_contents(null)
      return data
    } else {
      return null
    }
  }

  static mkdir(foldername: string) {
    const file = Gio.file_new_for_path(foldername)
    if (!file.query_exists(null)) {
      print("folder not found "+foldername)
      file.make_directory(null)

    }

  }

  static writeFile(filename: string, data: string) {
    const file = Gio.file_new_for_path(filename)

    if (file.query_exists(null)) file.delete(null)
    let file_stream = file.create(Gio.FileCreateFlags.NONE, null)     
    let data_stream = new Gio.DataOutputStream({base_stream: file_stream})
    data_stream.put_string(data, null)
  }

  static loadTemplate(template) {
    return Lang.Class({
      Name: template.name,
      Extends: template.extends,
      Template: Util.readFile(template.path),
      Children: template.fields,
      _init: function(params) {
        return this.parent(params)
      }
    })
  }
}

