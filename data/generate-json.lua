#!/usr/bin/env lua

package.path = "love-api/?.lua;" .. "dkjson/?.lua;" .. package.path
local loveapi = require('love_api')
local json = require('dkjson')

local WIKI_ROOT = 'https://love2d.org/wiki/'

local output = {}
output['love'] = {
  type = 'module',
  description = 'The root LOVE module.',
  url = WIKI_ROOT .. 'love'
}

for _, module in ipairs(loveapi.modules) do
  local name = 'love.' .. module.name
  output[name] = {
    type = 'module',
    description = module.description,
    url = WIKI_ROOT .. name
  }
end

local file = io.open ('api.json', 'w')
file:write(json.encode(output, { indent = true }))
file:close()
