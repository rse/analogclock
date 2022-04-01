
AnalogClock
===========

**Analog Clock for OBS Studio**

Abstract
--------

**AnalogClock** is a plain HTML/CSS/JS Browser Source layer for [OBS
Studio](http://obsproject.com/) or [vMix](https://www.vmix.com/) for
displaying a classical analog clock based timer. This is usually used as
a count-down until an event starts or as a duration for a pause.

![AnalogClock screenshot](screenshot.png)

Usage
-----

1. Install [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/).

2. Clone the **AnalogClock** sources:<br/>
   `git clone --depth 1 https://github.com/rse/analogclock`<br/>
   `cd analogclock`<br/>

3. Download all dependencies:<br/>
   `$ npm install`

4. Add your *Browser Source* source to *OBS Studio*:

   - Local File: **(disabled)**
   - URL: *local-path*`/analogclock/index.html?`*options*
   - Width: **1920** (or whatever is your stream resolution width)
   - Height: **1080** (or whatever is your stream resolution height)
   - Use custom frame rate: **(disabled)**
   - Control audio via OBS: **(disabled)**
   - Custom CSS: **(empty)**
   - Shutdown source when not visible: **(enabled)**
   - Refresh browser when scene becomes active: **(enabled)**

   Or add your *Web Browser* input to *vMix*:

   - URL: `file://`*local-path*`/analogclock/index.html?`*options*
   - Width: **1920** (or whatever is your stream resolution width)
   - Height: **1080** (or whatever is your stream resolution height)

Options
-------

### Time Options

- **until**=*iso-time* (duration for segment display until time in ISO format `YYYY-MM-DDTHH:MM:SS`, default: none)
- **duration**=*minutes* (duration for segment display in 1-60 minutes, default: none)
- **fraction**=*minutes* (fraction in minutes to round up duration, default: none)
- **autostop** (whether to automatically stop clock when timer ended, default: none)

Hint: if either option `duration` or `until` are given, the clock with
show a done/todo-segment and automatically shuts down once the ending
time is reached.

### Size Options

- **width**=*pixels* (width of clock in pixels, default: `500`)
- **height**=*pixels* (height of clock in pixels, default: `500`)
- **opacity**=*number* (amount of opacity of clock in 0.0-1.0 range, default: `0.8`)

### Color Options

- **background1**=*color* (outer border color, default: `#555555`)
- **background2**=*color* (inner background color, default: `#f0f0f0`)
- **ticks**=*color* (color of ticks, default: `#333333`)
- **digits**=*color* (color of digits, default: `#666666`)
- **pointer1**=*color* (color of hour pointer, default: `#000000`)
- **pointer2**=*color* (color of minute pointer, default: `#222222`)
- **pointer3**=*color* (color of second pointer, default: `#cc0000`)
- **segment1**=*color* (outer color of done segment display, default: `#b06820`)
- **segment2**=*color* (inner color of done segment display, default: `#f4dbc2`)
- **segment3**=*color* (outer color of todo segment display, default: `#2068b0`)
- **segment4**=*color* (inner color of todo segment display, default: `#c2dbf4`)

License
-------

Copyright (c) 2021-2022 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

