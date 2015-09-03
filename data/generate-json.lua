#!/usr/bin/env lua

package.path = "love-api/?.lua;" .. "dkjson/?.lua;" .. package.path
local loveapi = require('love_api')
local json = require('dkjson')

local output = {}

local file = io.open ('api.json', 'w')
file:write(json.encode(output, { indent = true }))
file:close()
