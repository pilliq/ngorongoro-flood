const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const width = 600, height = 500;
const backdropDelay = 250;

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
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.state === 2) {
            this.clear();
            this.appendBackdrop(this.floodAccum);
        } else {
            this.clear();
        }
    }

    appendBackdrop(cb) {
        const backdrop = this.svg.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'rgba(255,255,255,0)');
        backdrop.transition().ease(d3.easeLinear).duration(backdropDelay)
            .attr('fill', 'rgba(255,255,255,1)')
            .on('end', cb.bind(this));
    }

    floodAccum() {
        const svg = this.svg;
        var accumed = svg.append('rect')
            .attr('width', width)
            .attr('height', 0)
            .attr('x', 0)
            .attr('transform', 'scale(1,-1)translate(0,'+ (-height) + ')')
            .attr('fill', 'rgba(0,0,255,0.5)');

        var circles = svg.selectAll('circle').data(d3.range(10));
        var diameter = width/10;
        var circleEnter = circles.enter().append('circle')
            .attr('r', diameter/2 + 8) // 8 is just padding to make the waves less sharp
            .attr('cx', function(d,i) { return (i * diameter) + diameter/2; })
            .attr('cy', height)
            .attr('fill', 'white');

        var stat = svg.append('text')
            .attr('x', width/2)
            .attr('y', height/2)
            .attr('font-size', 52)
            .attr('font-family', 'Verdana')
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .text('000 mm')

        var label = svg.append('text')
            .attr('x', width/2)
            .attr('y', height/2 + (52))
            .attr('font-size', 28)
            .attr('font-family', 'Verdana')
            .attr('text-anchor', 'middle')
            .attr('fill', 'rgba(0,0,0,0)')
            .text('Total accummulated flood water')

        var duration = 2100;
        var waveHeight = height * .87;

        var formatNumber = d3.format('.0f');
        stat.transition().ease(d3.easeLinear).duration(duration)
            .tween('text', function() {
                var node = d3.select(this);
                var i = d3.interpolate(0, 500);
                return function(t) {
                    node.text(formatNumber(i(t)) + ' mm');
                }
            });

        var t = d3.transition()
            .ease(d3.easeBackOut)
            .duration(duration);
        circleEnter.transition(t)
            .attr('cy', height - (waveHeight));
        accumed.transition(t)
            .attr('height', waveHeight)
            .on('end', () => {
                label.transition().duration(800)
                    .attr('fill', 'rgba(0,0,0,1)');
            });
    }

    clear() {
        this.svg.selectAll('*').interrupt().remove();
    }

}

module.exports = VizComponent;
