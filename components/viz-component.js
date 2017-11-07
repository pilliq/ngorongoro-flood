const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 600, height = 500;
const clearTransitionDelay = 250;

class VizComponent extends React.Component {
    render() {
        return (
            <div id="viz" className={this.props.className} style={this.props.style}></div>
        );
    }
    componentDidMount() {
        const svg = this.svg = d3.select('#viz').append('svg');
        svg.attr('width', width)
           .attr('height', height)
        this.removeElems = null;
        this.drawnElems = null;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.state === 2) {
            this.clear(false, () => {
                this.appendBackdrop(this.floodAccum);
                this.removeElems = this.removeFloodAccum;
            });
        } else if (nextProps.state === 3) {
            this.clear(false, () => {
                this.appendBackdrop(this.affectedPeople);
                this.removeElems = this.removeAffectedPeople;
            });
        } else if (nextProps.state === 5) {
            this.clear(false, () => {
                this.appendBackdrop(this.siteAnalysis);
                this.removeElems = this.removeSiteAnalysis;
            });
        } else {
            this.clear(true, () => {});
        }
    }

    floodAccum() {
        const svg = this.svg;
        this.drawnElems = {};
        const water = this.drawnElems.water = svg.append('rect')
            .attr('class', 'water')
            .attr('width', width)
            .attr('height', 0)
            .attr('x', 0)
            .attr('transform', 'scale(1,-1)translate(0,'+ (-height) + ')')
            .attr('fill', 'rgba(0,0,255,0.5)');

        const diameter = width/10;
        const waves = svg.selectAll('circle.wave').data(d3.range(10));
        const wavesEnter = this.drawnElems.waves = waves.enter().append('circle')
            .attr('class', 'wave')
          .merge(waves)
            .attr('r', diameter/2 + 8) // 8 is just padding to make the waves less sharp
            .attr('cx', (d,i) => (i * diameter) + diameter/2)
            .attr('cy', height)
            .attr('fill', 'rgba(255,255,255,1)');

        const stat = this.drawnElems.stat = svg.append('text')
            .attr('x', width/2)
            .attr('y', height/2)
            .attr('font-size', 52)
            .attr('font-family', 'Verdana')
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('fill', 'rgba(0,0,0,1)')
            .text('000 mm')

        const label = this.drawnElems.label = svg.append('text')
            .attr('x', width/2)
            .attr('y', height/2 + (52))
            .attr('font-size', 28)
            .attr('font-family', 'Verdana')
            .attr('text-anchor', 'middle')
            .attr('fill', 'rgba(0,0,0,0)')
            .text('Total accummulated flood water')

        const duration = 2100;
        const waveHeight = height * .87;

        const formatNumber = d3.format('.0f');
        stat.transition().ease(d3.easeLinear).duration(duration)
            .tween('text', function() {
                var node = d3.select(this);
                var i = d3.interpolate(0, 500);
                return function(t) {
                    node.text(formatNumber(i(t)) + ' mm');
                }
            });

        const t = d3.transition()
            .ease(d3.easeBackOut)
            .duration(duration);
        wavesEnter.transition(t)
            .attr('cy', height - (waveHeight));
        water.transition(t)
            .attr('height', waveHeight)
            .on('end', () => {
                label.transition().duration(800)
                    .attr('fill', 'rgba(0,0,0,1)');
            });
    }

    removeFloodAccum(cb) {
        const t = d3.transition()
            .ease(d3.easeLinear)
            .duration(clearTransitionDelay);
        this.drawnElems.water.transition(t)
            .attr('height', 0)
            .attr('fill', 'rgba(0,0,255,0');
        this.drawnElems.waves.transition(t)
            .attr('cy', height)
            .attr('fill', 'rgba(255,255,255,0');
        this.drawnElems.stat.transition(t)
            .attr('fill', 'rgba(0,0,0,0)');
        this.drawnElems.label.transition(t)
            .attr('fill', 'rgba(0,0,0,0)');
        t.on('end', cb.bind(this));
    }

    affectedPeople() {
        const svg = this.svg;
        this.drawnElems = {};

        const getX = function(i) {
            return (i%30) * 17;
        }
        const getY = function(i) {
            return (i%35) * 17;
        }
        const isAffected = function(i) {
            const x = getX(i);
            const y = getY(i);
            var affected = false;
            if (x > 100 && x < 400 && y > 100 && y < 400) {
                affected = true;
            }
            return affected;
        }
        const people = svg.selectAll('g.person').data(d3.range(500));
        const peopleEnter = this.drawnElems.people = people.enter().append('g')
            .attr('class', (d,i) => {
                return `person ` + (isAffected(i) ? 'affected' : 'not-affected')
            })
          .merge(people)
            .attr('fill', 'white')
            .attr('transform', (d,i) => `translate(${getX(i)},${getY(i)})scale(.3)`)

        peopleEnter.append('path')
            .attr('transform', 'matrix(1.25,0,0,-1.25,359.06468,506.51275)')
            .attr('d', 'M-237.575,383.262c4.162,0,7.538,3.376,7.538,7.539c0,4.166-3.376,7.541-7.538,7.541c-4.166,0-7.539-3.376-7.539-7.541C-245.113,386.638-241.74,383.262-237.575,383.262');
        peopleEnter.append('path')
            .attr('transform', 'matrix(1.25,0,0,-1.25,367.39906,508.44512)')
            .attr('d', 'M-235.914,382.874c5.333,0,9.702-4.327,9.702-9.657v-23.384c0-1.821-1.433-3.298-3.257-3.298c-1.821,0-3.302,1.478-3.302,3.298v21.084h-1.702v-58.663c0-2.446-1.996-4.425-4.439-4.425c-2.446,0-4.425,1.979-4.425,4.425v34.063h-1.815v-34.063c0-2.446-1.979-4.425-4.421-4.425c-2.443,0-4.425,1.979-4.425,4.425c0,3.614-0.039,58.663-0.039,58.663h-1.68v-21.084c0-1.821-1.478-3.298-3.302-3.298c-1.823,0-3.257,1.478-3.257,3.298v23.384c0,5.33,4.368,9.657,9.705,9.657H-235.914z');
        const duration = 1000;
        const t = d3.transition()
            .ease(d3.easeLinear)
            .duration(duration);
        peopleEnter.transition(t)
            .attr('fill', 'rgba(0,0,0,1)')
          .transition().delay(2500).duration(1000)
            .attr('fill', (d,i) => isAffected(i) ? 'rgba(255,0,0,1)' : 'rgba(0,0,0,0)')
    }

    removeAffectedPeople(cb) {
        const t = d3.transition()
            .ease(d3.easeLinear)
            .duration(clearTransitionDelay)
        this.drawnElems.people.selectAll('g path').transition(t)
            .attr('fill', 'white')
        t.on('end', cb.bind(this));
    }

    siteAnalysis() {
        const svg = this.svg;
        this.drawnElems = {};
        const pattern = this.svg.append('defs').append('pattern')
            .attr('id', 'diagonal-stripe-2')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 10)
            .attr('height', 10)
          .append('image')
            .attr('xlink:href', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J2JsYWNrJyBzdHJva2Utd2lkdGg9JzInLz4KPC9zdmc+')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10);
        const outerCircle = this.drawnElems.outerCircle = svg.append('circle')
            .attr('class', 'outer')
            .attr('cx', width/2)
            .attr('cy', height/2)
            .attr('r', (height - (height * .2))/2)
            .attr('fill', 'rgba(0,0,0,0)')
            .attr('stroke', 'rgba(0,0,0,0)')
        const innerCircle = this.drawnElems.innerCircle = svg.append('circle')
            .attr('class', 'inner')
            .attr('cx', width/2)
            .attr('cy', height/2)
            .attr('r', (height - (height * .3))/2)
            .attr('fill', 'rgba(255,255,255,1)')
            .attr('stroke', 'rgba(0,0,0,0)')
        const buildings = this.drawnElems.buildings = svg.append('circle')
            .attr('class', 'buildings')
            .attr('cx', width/2)
            .attr('cy', height/2)
            .attr('r', (height * .3)/2)
            .attr('fill', 'rgba(255,255,255,0)')
            .attr('stroke', 'rgba(0,0,0,0)')
        const graze = this.drawnElems.graze = svg.append('circle')
            .attr('class', 'graze')
            .attr('cx', width/2)
            .attr('cy', height/2)
            .attr('r', (height * .2)/2)
            .attr('fill', 'rgba(255,255,255,0)')
            .attr('stroke', 'rgba(0,0,0,0)')
        const square = this.drawnElems.square = svg.append('rect')
            .attr('class', 'square')
            .attr('width', 0)
            .attr('height', 10)
            .attr('x', width*.1)
            .attr('y', height*.1)
            .attr('fill', 'rgba(255,255,255,0)')
            .attr('stroke', 'rgba(0,0,0,1)')
            .attr('stroke-width', '1px')
            .attr('stroke-dasharray', '3,3');
        const label = this.drawnElems.label = svg.append('text')
            .attr('class', 'label')
            .attr('x', width/2)
            .attr('y', height/2)
            .attr('font-size', 28)
            .attr('font-family', 'Verdana')
            .attr('text-anchor', 'middle')
            .attr('fill', 'rgba(0,0,0,0)')
            .text('10 square meters')

        square.transition().ease(d3.easeLinear).duration(1000)
            .attr('width', width - (width * .2))
        .transition().ease(d3.easeLinear).duration(1000)
            .attr('height', height - (height * .2))
        label.transition().ease(d3.easeLinear).delay(2000).duration(800)
            .attr('fill', 'rgba(0,0,0,1)')

        const t = d3.transition()
            .duration(500)
            .ease(d3.easeLinear);
        square.transition(t).delay(5000)
            .attr('stroke', 'rgba(0,0,0,0)')
            .remove()
        label.transition(t).delay(4000)
            .attr('fill', 'rgba(0,0,0,0)')
            .remove()
        outerCircle.transition(t).delay(5000).duration(800)
            .attr('stroke', 'rgba(0,0,0,1)')
        innerCircle.transition(t).delay(6000).duration(800)
            .attr('stroke', 'rgba(0,0,0,1)')
        outerCircle.transition(t).delay(8000).duration(800)
            .attr('fill', 'green')
        graze.transition(t).delay(9000).duration(800)
            .attr('fill', 'green')
            .attr('stroke', 'rgba(0,0,0,1)')
        buildings.transition(t).delay(11000).duration(800)
            .attr('fill', 'url(#diagonal-stripe-2)')
            .attr('stroke', 'rgba(0,0,0,1)')
    }

    removeSiteAnalysis(cb) {
        const t = d3.transition()
            .ease(d3.easeLinear)
            .duration(clearTransitionDelay);
        this.drawnElems.square.transition(t)
            .attr('width', 0)
            .attr('height', 0);
        this.drawnElems.label.transition(t)
            .attr('fill', 'rgba(0,0,0,0)');
        this.drawnElems.innerCircle.transition(t)
            .attr('stroke', 'rgba(0,0,0,0)');
        this.drawnElems.outerCircle.transition(t)
            .attr('stroke', 'rgba(0,0,0,0)');
        this.drawnElems.graze.transition(t)
            .attr('fill', 'rgba(255,255,255,0)')
            .attr('stroke', 'rgba(255,255,255,0)');
        t.on('end', cb.bind(this));
    }

    appendBackdrop(cb) {
        const backdrop = this.svg.append('rect')
            .attr('class', 'backdrop')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'rgba(255,255,255,0)');
        backdrop.transition().ease(d3.easeLinear).duration(clearTransitionDelay)
            .attr('fill', 'rgba(255,255,255,1)')
            .on('end', cb.bind(this));
    }

    unappendBackdrop(cb) {
        const backdrop = this.svg.select('rect.backdrop');
        backdrop.transition().ease(d3.easeLinear).duration(clearTransitionDelay)
            .attr('fill', 'rgba(255,255,255,0)')
            .on('end', cb.bind(this))
            .remove();
    }

    clear(removeBackdrop, cb) {
        console.log('clearing');
        const callback = cb.bind(this);
        if (this.removeElems !== null && this.drawnElems !== null) {
            this.removeElems(() => {
                this.drawnElems = null;
                this.removeElems = null;
                if (removeBackdrop) {
                    this.unappendBackdrop(() => {
                        this.svg.selectAll('*').interrupt().remove();
                        callback();
                    });
                } else {
                    callback();
                }
            });
        } else {
            callback();
        }
    }

}

module.exports = VizComponent;
