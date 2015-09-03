#!/usr/bin/env lua

-- Load all of the dependencies.
package.path = "underscore.lua/lib/?.lua;" .. "love-api/?.lua;" .. "dkjson/?.lua;" .. package.path
local loveapi = require('love_api')
local json = require('dkjson')
local _ = require('underscore')

local WIKI_ROOT = 'https://love2d.org/wiki/'

local output = {}
output['love'] = {
  type = 'module',
  description = 'The root LOVE module.',
  url = WIKI_ROOT .. 'love'
}

function generateArgs(func)
  local variant = func.variants[1]
  local arguments = ""
  if variant.arguments ~= nil then
    arguments = _(variant.arguments):chain():map(function(arg)
      return arg.name
    end):join(', '):value()
  end
  return arguments
end

-- Generate data for the root modules.
for i, module in ipairs(loveapi.modules) do
  local modulename = 'love.' .. module.name
  output[modulename] = {
    type = 'module',
    description = module.description,
    url = WIKI_ROOT .. modulename
  }

  for j, func in ipairs(module.functions) do
    local funcname = modulename .. '.' .. func.name
    local args = generateArgs(func)

    local snippet = funcname .. "(" .. args .. ")"
    output[funcname] = {
      type = 'function',
      description = func.description,
      url = WIKI_ROOT .. funcname,
      snippet = snippet
    }
  end
end

-- Generate data for all of the callbacks.
for i, callback in ipairs(loveapi.callbacks) do
  local name = 'love.' .. callback.name
  local args = generateArgs(callback)

  local snippet = "function " .. name .. "(" .. args .. ")\n\t${0:-- body...}\nend"
  output[name] = {
    type = 'callback',
    description = callback.description,
    url = WIKI_ROOT .. name,
    snippet = snippet
  }
end

local file = io.open('api.json', 'w')
file:write(json.encode(output, {indent = true}))
file:close()
