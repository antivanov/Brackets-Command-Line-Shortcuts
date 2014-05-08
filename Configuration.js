define(function (require, exports, module) {

  var DocumentManager = brackets.getModule("document/DocumentManager");
  var FileUtils = brackets.getModule("file/FileUtils");
  var CommandManager = brackets.getModule("command/CommandManager");
  var Menus = brackets.getModule("command/Menus");
  var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
  var ProjectManager = brackets.getModule('project/ProjectManager');

  var Util = require("./Util").Util;

  var CONFIGURE_COMMAND_LINE_COMMAND_ID = "extension.commandline.configure.id";

  function addMenuItem() {
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);

    CommandManager.register(
      "Command Line Shortcuts", 
      CONFIGURE_COMMAND_LINE_COMMAND_ID, function() {
        var src = FileUtils.getNativeModuleDirectoryPath(module) + "/brackets-commandline.json";

      DocumentManager.getDocumentForPath(src).done(
        function (doc) {
          DocumentManager.setCurrentDocument(doc);
        }
      );
    });
    menu.addMenuItem(CONFIGURE_COMMAND_LINE_COMMAND_ID, 'Ctrl-Shift-Q');
  }

  addMenuItem();

  function Configuration() {
  }

  Configuration.prototype.runtimeDir = function(entry) {
    var projectRoot = Util.stripTrailingPathSeparator(ProjectManager.getProjectRoot().fullPath);

    return entry.dir.replace(/\$PROJECT_ROOT/g, projectRoot);
  }

  Configuration.prototype.read = function(entryCallback) {
    var configuration = JSON.parse(require('text!brackets-commandline.json'));

    configuration.forEach(function(entry, idx) {
      var commandId = 'extension.commandline.run.' + idx;

      CommandManager.register(
        entry.name,
        commandId,
        entryCallback(entry)
      );
      KeyBindingManager.addBinding(commandId, entry.shortcut);
    });
  };

  exports.Configuration = Configuration;
});