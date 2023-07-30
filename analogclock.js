/*
**  AnalogClock ~ Analog Clock for OBS Studio or vMix
**  Copyright (c) 2021-2023 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  the clock knowledge encapsulation  */
class AnalogClock {
    constructor (props = {}) {
        /*  take over properties  */
        this.props = {
            width:       500,
            height:      500,
            opacity:     1.0,
            background1: "#555555",
            background2: "#f0f0f0",
            background3: "#ffcc66",
            background4: "#ff6666",
            ticks:       "#333333",
            digits:      "#666666",
            pointer1:    "#000000",
            pointer2:    "#222222",
            pointer3:    "#cc0000",
            segment1:    "#b06820",
            segment2:    "#f4dbc2",
            segment3:    "#2068b0",
            segment4:    "#c2dbf4",
            silent:      false,
            lang:        "en",
            ...props
        }

        /*  initialize internal state  */
        this.duration   = 0
        this.remaining  = 0
        this.started    = null
        this.show       = false
        this.interval   = null
        this.ending     = 0
        this.ended      = false
        this.flashed    = false
        this.ticked     = false
        this.left       = {}
        this.at         = {}
        this.soundid    = null
        this.svg        = null
        this.svg2       = null
        this.svg3       = null
        this.svgRefs    = {}

        /*  create DOM fragment  */
        this.el = $(`
            <div class="analogclock">
                <div class="canvas">
                    <div class="svg1"></div>
                    <div class="svg2"></div>
                    <div class="svg3"></div>
                </div>
            </div>
        `)
        $(this.el)
            .css("width",  `${this.props.width}px`)
            .css("height", `${this.props.height}px`)
            .css("opacity", this.props.opacity)
        this.elCanvas = $(".canvas",       this.el).get(0)
        this.elSVG1   = $(".canvas .svg1", this.el).get(0)
        this.elSVG2   = $(".canvas .svg2", this.el).get(0)
        this.elSVG3   = $(".canvas .svg3", this.el).get(0)

        /*  inject DOM fragment into DOM tree  */
        $("body").append(this.el)
    }
    start (options = {}) {
        /*   allow restarting the interval timer  */
        if (this.interval)
            clearTimeout(this.interval)

        /*  setup an update interval  */
        this.interval = setInterval(async () => {
            if (this.ending > 0) {
                for (const p of [ 33, 66 ]) {
                    if (this.at[p] && !this.at[p].done && moment().isSameOrAfter(moment.unix(this.at[p].time))) {
                        if (!this.props.silent) {
                            const id = soundvm.play(`time-at-${p}p-${this.props.lang}`)
                            await new Promise((resolve) => soundvm.once("play", resolve, id))
                        }
                        this.at[p].done = true
                        break
                    }
                }
                for (const i of [ 5, 4, 3, 2, 1 ]) {
                    if (this.left[i] && this.left[i].time > 0 && !this.left[i].done &&
                        moment().isSameOrAfter(moment.unix(this.left[i].time))) {
                        if (!this.props.silent) {
                            const id = soundvm.play(`time-left-${i}m-${this.props.lang}`)
                            await new Promise((resolve) => soundvm.once("play", resolve, id))
                        }
                        this.left[i].done = true
                        if (!this.flashed) {
                            this.flashed = true
                            this.attention(5, "soft")
                            if (!this.props.silent)
                                soundfx.play("jingle2")
                        }
                        break
                    }
                }
                if (!this.ended && moment().isSameOrAfter(moment.unix(this.ending))) {
                    /*  end timer  */
                    if (!this.props.silent) {
                        const id = soundvm.play(`time-left-0m-${this.props.lang}`)
                        await new Promise((resolve) => soundvm.once("play", resolve, id))
                        soundfx.play("scale1")
                    }
                    this.ended  = true
                    this.ending = 0
                    this.attention(5, "hard").then(() => {
                        if (options.autostop)
                            this.stop()
                    })
                }
            }
            this.update()
        }, 50)

        /*  once render timer and fly it in  */
        setTimeout(() => {
            this.update()
            if (!this.props.silent)
                soundfx.play("slide4")
            anime({
                targets:   this.elCanvas,
                duration:  1000,
                autoplay:  true,
                direction: "normal",
                easing:    "easeOutBounce",
                delay:     200,
                bottom:    [ 2000, 0 ],
                opacity:   [ 1.0, 1.0 ]
            })
        }, 0)

        /*  optionally start timer  */
        this.timer(options)
    }
    stop () {
        /*  fly timer out and stop updating  */
        if (!this.props.silent)
            soundfx.play("whoosh2")
        return anime({
            targets:   this.elCanvas,
            duration:  1000,
            autoplay:  true,
            direction: "normal",
            easing:    "easeOutSine",
            delay:     0,
            opacity:   [ 1.0, 0.0 ]
        }).finished.then(() => {
            if (this.interval) {
                clearTimeout(this.interval)
                this.interval = null
            }
        })
    }
    timer (options) {
        /*  determine duration  */
        let duration = -1
        if (options.duration !== undefined) {
            duration = moment.duration(parseInt(options.duration), "m").asSeconds()
            if (duration > (60 * 60))
                duration = (60 * 60)
        }
        else if (options.until !== undefined) {
            duration = moment.duration(moment(options.until).diff(moment())).asSeconds()
            if (duration < 0)
                duration = 1
        }

        /*  determine the duration-related information  */
        if (duration > 0) {
            const now = moment().unix()
            this.started   = now
            this.ending    = now + duration
            if (options.fraction !== undefined)
                this.ending = Math.ceil(this.ending / (5 * 60)) * (5 * 60)
            this.ended     = false
            this.flashed   = false
            this.left = {
                5: { time: (this.ending - this.started) > 5 * 60 ? this.ending - 5 * 60 : 0, done: false },
                4: { time: (this.ending - this.started) > 4 * 60 ? this.ending - 4 * 60 : 0, done: false },
                3: { time: (this.ending - this.started) > 3 * 60 ? this.ending - 3 * 60 : 0, done: false },
                2: { time: (this.ending - this.started) > 2 * 60 ? this.ending - 2 * 60 : 0, done: false },
                1: { time: (this.ending - this.started) > 1 * 60 ? this.ending - 1 * 60 : 0, done: false }
            }
            this.at = {
                33: { time: this.started + ((this.ending - this.started) / 3), done: false },
                66: { time: this.ending  - ((this.ending - this.started) / 3), done: false }
            }
            this.segFrom   = (this.started / 60) % 60
            this.segNow    = this.segFrom
            this.segTo     = (this.ending / 60) % 60
        }
        else if (duration === 0) {
            this.ending   = 0
            this.ended    = true
        }
    }
    attention (level = 1, type = "soft") {
        /*  fly timer out and stop updating  */
        let opacity = []
        for (let i = 0; i < level; i++)
            opacity = opacity.concat([ 0.0, 0.5 ])
        opacity = opacity.concat([ 0.0 ])
        return anime({
            targets:   type === "soft" ? this.elSVG2 : this.elSVG3,
            duration:  level * 1000,
            autoplay:  true,
            direction: "normal",
            easing:    "easeInOutSine",
            delay:     0,
            opacity
        }).finished
    }
    hint (type) {
        if (this.props.silent)
            return Promise.resolve()
        let id
        if (type === "message")
            id = soundvm.play(`hint-message-${this.props.lang}`)
        else if (type === "faster")
            id = soundvm.play(`speed-faster-${this.props.lang}`)
        else if (type === "slower")
            id = soundvm.play(`speed-slower-${this.props.lang}`)
        else
            throw new Error("invalid hint type")
        return new Promise((resolve) => soundvm.once("play", resolve, id))
    }
    update () {
        if (this.svg2 === null) {
            /*  initially render overlay  */
            const el = this.elSVG2
            const W = el.clientWidth
            const H = el.clientHeight
            const svg = SVG().addTo(el).size(W, H)
            this.svg2 = svg
            const R = Math.ceil(W / 2)
            svg.circle(R * 2).move(0, 0).fill(this.props.background3)
        }
        if (this.svg3 === null) {
            /*  initially render overlay  */
            const el = this.elSVG3
            const W = el.clientWidth
            const H = el.clientHeight
            const svg = SVG().addTo(el).size(W, H)
            this.svg3 = svg
            const R = Math.ceil(W / 2)
            svg.circle(R * 2).move(0, 0).fill(this.props.background4)
        }
        if (this.svg === null) {
            /*  initially render clock  */
            const el = this.elSVG1
            const W = el.clientWidth
            const H = el.clientHeight
            const svg = SVG().addTo(el).size(W, H)
            this.svg = svg
            const R = Math.ceil(W / 2)

            /*  create backgrounds  */
            svg.circle(R * 2).move(0, 0).fill(this.props.background1)
            svg.circle(R * 2 - 20).move(10, 10).fill(this.props.background2)
            this.svgRefs.segment1 = svg.group()
            this.svgRefs.segment2 = svg.group()
            this.svgRefs.segment3 = svg.group()
            this.svgRefs.segment4 = svg.group()
            svg.circle(40).move(R - 20, R - 20).fill(this.props.background1)

            /*  create tick lines  */
            for (let i = 1; i <= 60; i++) {
                const w = i % 15 === 0 ? 8 : (i % 5 === 0 ? 8 : 2)
                const l = i % 15 === 0 ? 30 : (i % 5 === 0 ? 20 : 20)
                svg.line(0, 0, 0, l)
                    .move(R, 30)
                    .rotate((360 / 60) * i, R, R)
                    .stroke({ color: this.props.ticks, width: w })
                    .css({ "stroke-linecap": "round" })
                if (i % 5 === 0) {
                    const g = svg.group()
                    const digit = (i / 5).toString()
                    const t = g.text(digit)
                        .fill(this.props.digits)
                        .font({
                            family: "Source Sans Pro",
                            anchor: "middle",
                            size:   (i / 5) % 3 === 0 ? 65 : 55,
                            weight: (i / 5) % 3 === 0 ? "bold" : "normal"
                        })
                    g.center(R, (i / 5) % 3 === 0 ? 100 : 90)
                        .rotate((360 / 12) * (i / 5), R, R)
                    t.rotate(-(360 / 12) * (i / 5))
                }
            }

            /*  create pointers  */
            this.svgRefs.p1 = svg.line(0, 0, 0, R - (30 + 100))
                .move(R, 30 + 100)
                .stroke({ color: this.props.pointer1, width: 25 })
                .css({ "stroke-linecap": "round" })
            this.svgRefs.p2 = svg.line(0, 0, 0, R - 30)
                .move(R, 30)
                .stroke({ color: this.props.pointer2, width: 15 })
                .css({ "stroke-linecap": "round" })
            this.svgRefs.p3 = svg.line(0, 0, 0, R - 30)
                .move(R, 30)
                .stroke({ color: this.props.pointer3, width: 5 })
                .css({ "stroke-linecap": "round" })
        }

        /*  update clock pointers  */
        const el = this.elSVG1
        const W = el.clientWidth
        const R = Math.ceil(W / 2)
        const now = moment()
        const H  = now.hours()
        const M  = now.minutes()
        const S  = now.seconds()
        const MS = now.milliseconds()
        this.svgRefs.p1.untransform().rotate((360 / 12) * (H % 12) + (360 / 12) / 60   * M,  R, R)
        this.svgRefs.p2.untransform().rotate((360 / 60) * M        + (360 / 60) / 60   * S,  R, R)
        this.svgRefs.p3.untransform().rotate((360 / 60) * S        + (360 / 60) / 1000 * MS, R, R)

        if (S === 0 && !this.ticked) {
            if (!this.props.silent)
                soundfx.play("click5")
            this.ticked = true
        }
        else if (S > 0)
            this.ticked = false

        /*  redraw clock segment  */
        if (this.segFrom && !this.ended) {
            this.segNow = M + (1 / 60) * S
            const deg1 = (360 / 60) * this.segFrom
            const deg2 = (360 / 60) * this.segNow
            const deg3 = (360 / 60) * this.segTo
            const rad1 = SVG.utils.radians(90 - deg1)
            const rad2 = SVG.utils.radians(90 - deg2)
            const rad3 = SVG.utils.radians(90 - deg3)
            const max12 = deg2 > deg1 ? (deg2 - deg1 > 180 ? 1 : 0) : (deg1 - deg2 > 180 ? 0 : 1)
            const max23 = deg3 > deg2 ? (deg3 - deg2 > 180 ? 1 : 0) : (deg2 - deg3 > 180 ? 0 : 1)
            const makeSegment = (seg, rad1, rad2, max, b, col) => {
                const x1 = R + Math.cos(rad1) * (R - b)
                const y1 = R - Math.sin(rad1) * (R - b)
                const x2 = R + Math.cos(rad2) * (R - b)
                const y2 = R - Math.sin(rad2) * (R - b)
                seg.clear()
                seg.path().M(R, R).L(x1, y1).A(R - b, R - b, 0, max, 1, { x: x2, y: y2 }).Z().fill(col)
            }
            const b = 10
            makeSegment(this.svgRefs.segment1, rad1, rad2, max12, 0, this.props.segment1)
            makeSegment(this.svgRefs.segment2, rad1, rad2, max12, b, this.props.segment2)
            makeSegment(this.svgRefs.segment3, rad2, rad3, max23, 0, this.props.segment3)
            makeSegment(this.svgRefs.segment4, rad2, rad3, max23, b, this.props.segment4)
        }
        else if (this.segFrom && this.ended) {
            this.svgRefs.segment1.clear()
            this.svgRefs.segment2.clear()
            this.svgRefs.segment3.clear()
            this.svgRefs.segment4.clear()
        }
    }
}

