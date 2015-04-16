# avahi-mdns-kludge
Simple MDNS discovery using Avahi CLI tools

This is mainly for Raspberry Pi, though it may
find usage elsewhere.

It is designed to work around this problem
with node-mdns. It makes no attempt 
to be compatible with that

    http://stackoverflow.com/questions/29589543/raspberry-pi-mdns-getaddrinfo-3008-error

# Installation

Make sure to run this command

    sudo apt-get install avahi-utils 

# How it works

It runs the following command every minute

    avahi-browse --all --resolve --terminate

and parses the result.

# Usage

    var amdns = require('avahi-mdns-kludge')
    amdns.browse(function(error, d) {
        console.log(d);
    });

