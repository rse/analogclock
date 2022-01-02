
AnalogClock
===========

**Analog Clock for OBS Studio**

Abstract
--------

**AnalogClock** is a plain HTML/CSS/JS Browser Source layer for [OBS
Studio](http://obsproject.com/) for displaying a classical analog clock
based timer. This is usually used as a count-down until an event starts
or as a duration for a pause.

![AnalogClock screenshot](screenshot.png)

Usage
-----

1. Install [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/).

2. Clone the **AnalogClock** sources:<br/>
   `git clone --depth 1 https://github.com/rse/analogclock`<br/>
   `cd analogclock`<br/>

3. Download all dependencies:<br/>
   `$ npm install`

4. Add your Browser Source to your scenes:

   - Local File: **(disabled)**
   - URL: *local-path*`/analogclock/index.html?`*options*
   - Width: **1280** (or whatever is your stream resolution width)
   - Height: **720* (or whatever is your stream resolution height)
   - Use custom frame rate: **(disabled)**
   - Control audio via OBS: **(disabled)**
   - Custom CSS: **(empty)**
   - Shutdown source when not visible: **(enabled)**
   - Refresh browser when scene becomes active: **(enabled)**

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

