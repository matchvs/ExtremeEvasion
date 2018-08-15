require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "https://data.tianziyou.com/matchvsGamesRes/extremeEvasion";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.3e0ba');
require('main.7834b');