/*
 *  lib/parse.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-04-16
 *
 *  Copyright [2013-2015] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

var partial = "";
var collectd = {};

/**
 *  Call me when starting
 */
var started = function () {
    partial = "";
    collectd = {};
};

/**
 *  Call with a line of data
 */
var line = function (line, callback) {
    if (line.match(/^=/)) {
        _emit(callback);
        return;
    }
        
    var match = line.match(/^\s*([^\s]*)\s*=\s*\[([^]*)]/);
    if (!match) {
        return;
    }

    var key = match[1];
    var value = match[2];
    collectd[key] = value;

    if (key !== "txt") {
        return;
    }

    value = value.substring(1, value.length - 1);
    var parts = value.split('" "');
    for (var pi in parts) {
        var part = parts[pi];
        var pmatch = part.match(/([^=]*)=(.*)/)
        if (pmatch && (collectd[pmatch[1]] === undefined)) {
            collectd[pmatch[1]] = pmatch[2];
        }
    }
};

/**
 *  Call with a complete buffer of data
 */
var buffer = function(chunk, callback) {
    var lines = (partial + chunk).split("\n");
    for (var li = 0; li < lines.length - 1; li++) {
        line(lines[li], callback);
    }

    partial = lines[li];
}

/**
 *  Call me when you expect no more data
 */
var finished = function (callback) {
    _emit(callback);
};

/**
 */
var _emit = function(callback) {
    if (Object.keys(collectd).length) {
        callback(null, collectd);
        collectd = {};
    }
}

/**
 *  API
 */
exports.started = started;
exports.line = line;
exports.buffer = buffer;
exports.finished = finished;
