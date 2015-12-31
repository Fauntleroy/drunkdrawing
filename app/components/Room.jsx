import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import rgb2hex from 'rgb2hex';

import { dimensions } from '../constants';

const { WIDTH, HEIGHT } = dimensions;

const firebase_ref = new Firebase('https://drunk-drawing.firebaseio.com/');

var Room = React.createClass({
  getInitialState: function(){
    return {
    };
  },
  componentWillMount: function(){
    this._room_ref = firebase_ref.child(`rooms/${this.props.params.id}`);
    this._drawing_ref = this._room_ref.child('drawing');
    this._drawing_ref.on('value', this.handleDrawingChange);
  },
  componentDidMount: function(){
    this._drawing_context = this.refs.drawing.getContext('2d');
    this._local_drawing_context = this.refs.local_drawing.getContext('2d');
  },
  componentWillUnmount: function(){
    this._drawing_ref.off('value', this.handleDrawingChange);
  },
  drawLine: function( x1, y1, x2, y2 ){
    this._local_drawing_context.beginPath();
    this._local_drawing_context.strokeStyle = '#000000';
    const scaledX1 = parseInt( x1 / 2 );
    const scaledY1 = parseInt( y1 / 2 );
    const scaledX2 = parseInt( x2 / 2 );
    const scaledY2 = parseInt( y2 / 2 );
    this._local_drawing_context.moveTo( scaledX1, scaledY1 );
    this._local_drawing_context.lineTo( scaledX2, scaledY2 );
    this._local_drawing_context.stroke();
    this.diffDrawings();
  },
  diffDrawings: _.throttle(function(){
    const drawing_data = this._drawing_context.getImageData( 0, 0, WIDTH, HEIGHT ).data;
    const local_drawing_data = this._local_drawing_context.getImageData( 0, 0, WIDTH, HEIGHT ).data;
    console.log('drawing data', drawing_data);
    for( let x = 0, y = 0, i = 0, ii = 0; i < drawing_data.length; x = ( i % WIDTH ), y = Math.ceil( i / WIDTH ), i += 4, ii++ ){
      let drawing_color = {
        r: drawing_data[i],
        g: drawing_data[i+1],
        b: drawing_data[i+2],
        a: drawing_data[i+3]
      };
      let local_drawing_color = {
        r: local_drawing_data[i],
        g: local_drawing_data[i+1],
        b: local_drawing_data[i+2],
        a: local_drawing_data[i+3]
      };
      if( !_.isEqual( drawing_color, local_drawing_color ) ){
        const color_hex = rgb2hex(`rgb(${local_drawing_color.r},${local_drawing_color.g},${local_drawing_color.b},${local_drawing_color.a})`);
        this._drawing_ref.child(`${x}:${y}`).set( color_hex.hex.replace('#','') );
      }
    }
  }, 500),
  handleDrawingChange: _.throttle(function( snapshot ){
    console.log('drawing change:', arguments);
    const drawing_data = snapshot.val();
    const context = this._drawing_context;
    _.forEach( drawing_data, (color, key) => {
      const [ x, y ] = key.split(':');
      context.fillStyle = `#${color}`;
      context.fillRect( x, y, 1, 1);
    });
  }, 250),
  handleMouseDown: function( event ){
    console.log('drawing start');
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    const { clientX, clientY } = event;
    this.setState({
      previousX: clientX,
      previousY: clientY
    });
    const { offsetLeft, offsetTop } = this.refs.drawing;
    const scaledX = parseInt( clientX / 5 );
    const scaledY = parseInt( clientY / 5 );
    this._drawing_ref.child(`${scaledX}:${scaledY}`).set('000');
  },
  handleMouseMove: _.throttle(function( event ){
    console.log('drawing move');
    const { previousX, previousY } = this.state;
    //this.drawLine( previousX, previousY, clientX, clientY );
    const { offsetLeft, offsetTop } = this.refs.drawing;
    const { clientX, clientY } = event;
    const scaledX = parseInt( clientX / 5 );
    const scaledY = parseInt( clientY / 5 );
    this._drawing_ref.child(`${scaledX}:${scaledY}`).set('000');
    this.setState({
      previousX: clientX,
      previousY: clientY
    });
  }, 5),
  handleMouseUp: function( event ){
    console.log('drawing end');
    const { previousX, previousY } = this.state;
    const { clientX, clientY } = event;
    //this.drawLine( previousX, previousY, clientX, clientY );
    this.setState({
      previousX: null,
      previousY: null
    });
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  },
  render: function(){
    return (
      <div className="room">
        <canvas ref="drawing" className="drawing" width={WIDTH} height={HEIGHT} onMouseDown={this.handleMouseDown} />
        <canvas ref="local_drawing" className="drawing drawing--local" width={WIDTH} height={HEIGHT} />
      </div>
    );
  }
});

const mapStateToProps = function( state ){
  return {
    drawing: state.drawing
  };
};

const mapDispatchToProps = {
};

Room = connect( mapStateToProps, mapDispatchToProps )( Room );

export default Room;
