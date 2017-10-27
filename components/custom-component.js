const React = require('react');

class CustomComponent extends React.Component {
  render() {
    const { hasError, updateProps, ...props } = this.props;
    return (
      <div {...props}>
        <iframe width="500" height="400" src="https://earth.nullschool.net/#current/wind/surface/level/orthographic=-327.18,-3.56,2579">
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    );
  }
}

module.exports = CustomComponent;
