import { actionTypes } from '../constants.js';
import getUserMedia from 'getusermedia';
import { findWhere } from 'lodash';

const IDEAL_WEBCAM_WIDTH = 640;
const IDEAL_WEBCAM_HEIGHT = 480;
const IDEAL_WEBCAM_RATIO = IDEAL_WEBCAM_WIDTH / IDEAL_WEBCAM_HEIGHT;

const getWebcamStream = function(){
  return ( dispatch, getState ) => {
    const state = getState();
    var optional_constraints = [{
      minAspectRatio: IDEAL_WEBCAM_RATIO
    }];
    if( state.webcam_sources.entities ){
      const webcam = findWhere( state.webcam_sources.entities, { active: true } );
      optional_constraints.push({
        sourceId: webcam.id
      });
    }
    var constraints = {
      video: {
        optional: optional_constraints
      },
      audio: false
    };
    dispatch({
      type: actionTypes.WEBCAM_STREAM_REQUEST
    });
    getUserMedia( constraints, ( error, stream ) => {
      if( error ){
        dispatch({
          type: actionTypes.WEBCAM_STREAM_REQUEST_ERROR,
          error
        });
      }
      else {
        dispatch({
          type: actionTypes.WEBCAM_STREAM_REQUEST_SUCCESS,
          entity: stream
        });
      }
    });
  };
};

export { getWebcamStream };
