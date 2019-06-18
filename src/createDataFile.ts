const fs = require('fs');
const pathModule = require("path");
const fullPath = require('./pathToDatabaseFile').fullPath;


(function (path) {
    path = fullPath;
    try {
      let fileDescriptorPath = fs.openSync(path, "r");
      fs.closeSync(fileDescriptorPath);
      return;
    } catch (error) {
      try {
        fs.mkdirSync(pathModule.dirname(path), { recursive: true });
        let outerObject = { data: [], isTimerDeactivated: true };
        let jsonVersionOfOO = JSON.stringify(outerObject);
        fs.writeFileSync(path, jsonVersionOfOO);
        return;
      } catch (error) {
        if (error.code !== "EEXIST") {
          console.log(error);
        } else {
          let outerObject = { data: [], isTimerDeactivated: true };
          let jsonVersionOfOO = JSON.stringify(outerObject);
          fs.writeFileSync(path, jsonVersionOfOO);
          return
        }
      }
    }
  })();