require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "https://imgs.matchvs.com/static/tianziyou/extremeEvasion";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.ec4c2');
require('main.6ce5c');