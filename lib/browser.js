/*
 *  lib/browser.js
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

var path = require('path');
var child_process = require('child_process')

var parse = require('./parse')

/**
 */
var browser = function(paramd, callback) {
    if (arguments.length === 1) {
        paramd = {};
        callback = arguments[0];
    }

    paramd.test = paramd.test || false;
    paramd.poll = paramd.poll || 60;

    var _scan = function() {
        var c_cmd = "avahi-browse";
        var c_av = [ "--all", "--resolve", "--terminate" ];

        if (paramd.test) {
            var c_cmd = "cat";
            var c_av = [ path.join(__dirname, "..", "data", "sample.txt"), ];
        }

        var c_process = child_process.spawn(c_cmd, c_av);

        parse.started();

        c_process.stdout.on('data', function(chunk) {
            parse.buffer(chunk, callback);
        });

        c_process.on('close', function() {
            parse.finished(callback);
        });

        c_process.stderr.on('data', function(data) {
            process.stderr.write(data);
        });
    }

    _scan();

    if (paramd.poll > 0) {
        setInterval(_scan, paramd.poll * 1000);
    }
};

/**
 *  API
 */
exports.browser = browser;
