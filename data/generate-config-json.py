#!/usr/bin/env python

import json
import re

root_url = "https://love2d.org/wiki/Config_Files"
text = '''
function love.conf(t)
    t.identity = nil                   -- The name of the save directory (string)
    t.version = "0.9.2"                -- The LOVE version this game was made for (string)
    t.console = false                  -- Attach a console, Windows only (boolean)

    t.window.title = "Untitled"        -- The window title (string)
    t.window.icon = nil                -- Filepath to an image to use as the window's icon (string)
    t.window.width = 800               -- The window width (number)
    t.window.height = 600              -- The window height (number)
    t.window.borderless = false        -- Remove all border visuals from the window (boolean)
    t.window.resizable = false         -- Let the window be user-resizable (boolean)
    t.window.minwidth = 1              -- Minimum window width if the window is resizable (number)
    t.window.minheight = 1             -- Minimum window height if the window is resizable (number)
    t.window.fullscreen = false        -- Enable fullscreen (boolean)
    t.window.fullscreentype = "normal" -- Standard fullscreen or desktop fullscreen mode (string)
    t.window.vsync = true              -- Enable vertical sync (boolean)
    t.window.fsaa = 0                  -- The number of samples to use with multi-sampled antialiasing (number)
    t.window.display = 1               -- Index of the monitor to show the window in (number)
    t.window.highdpi = false           -- Enable high-dpi mode for the window on a Retina display (boolean)
    t.window.srgb = false              -- Enable sRGB gamma correction when drawing to the screen (boolean)
    t.window.x = nil                   -- The x-coordinate of the window's position in the specified display (number)
    t.window.y = nil                   -- The y-coordinate of the window's position in the specified display (number)

    t.modules.audio = true             -- Enable the audio module (boolean)
    t.modules.event = true             -- Enable the event module (boolean)
    t.modules.graphics = true          -- Enable the graphics module (boolean)
    t.modules.image = true             -- Enable the image module (boolean)
    t.modules.joystick = true          -- Enable the joystick module (boolean)
    t.modules.keyboard = true          -- Enable the keyboard module (boolean)
    t.modules.math = true              -- Enable the math module (boolean)
    t.modules.mouse = true             -- Enable the mouse module (boolean)
    t.modules.physics = true           -- Enable the physics module (boolean)
    t.modules.sound = true             -- Enable the sound module (boolean)
    t.modules.system = true            -- Enable the system module (boolean)
    t.modules.timer = true             -- Enable the timer module (boolean), Disabling it will result 0 delta time in love.update
    t.modules.window = true            -- Enable the window module (boolean)
    t.modules.thread = true            -- Enable the thread module (boolean)
end
'''

output = {}
for line in text.splitlines():
    result = re.match('\s*(t.[a-z\.]+)\s*=\s*(.+?)\s*--\s*(.+)\s*\((.*)\)', line)
    if result:
        propname = result.group(1)
        defaultval = result.group(2)
        desc = result.group(3)
        val_type = result.group(4)

        output[propname] = {
            'default': defaultval,
            'description': desc[:-1] + '.',
            'url': root_url + "#" + propname[2:],
            'type': val_type
        }

with open('config-api.json', 'w') as f:
    f.write(json.dumps(output, indent=2, sort_keys=True))
