import _ from 'lodash';

import { actionTypes } from '../constants.js';

const DEFAULT_DRAWING_WIDTH = 427;
const DEFAULT_DRAWING_HEIGHT = 240;

const generateDrawingData = function( width = DEFAULT_DRAWING_WIDTH, height = DEFAULT_DRAWING_HEIGHT ){
  var drawing_data = {};
  _.times( width, x => {
    _.times( height, y => {
      drawing_data[x + ':' + y] = '000';
    });
  });
  return drawing_data;
};

const DEFAULT_STATE = {
  data: generateDrawingData()
};

const drawing = function( state = DEFAULT_STATE, action ){
  switch( action.type ){
    case actionTypes.WEBCAM_STREAM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.WEBCAM_STREAM_REQUEST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case actionTypes.WEBCAM_STREAM_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: action.entity
      };
    default:
      return state;
  };
};

export default drawing;
