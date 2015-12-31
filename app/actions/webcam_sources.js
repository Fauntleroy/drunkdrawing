import { actionTypes } from '../constants.js';
import getWebcams from '../utils/getWebcams.js';

const getWebcamSources = function(){
  return ( dispatch ) => {
    dispatch({
      type: actionTypes.WEBCAM_SOURCES_REQUEST
    });
    getWebcams(( error, webcams ) => {
      if( error ){
        dispatch({
          type: actionTypes.WEBCAM_SOURCES_REQUEST_ERROR,
          error
        })
      }
      else {
        dispatch({
          type: actionTypes.WEBCAM_SOURCES_REQUEST_SUCCESS,
          entities: webcams
        });
      }
    });
  };
};

const nextWebcamSource = function(){
  return {
    type: actionTypes.WEBCAM_SOURCES_NEXT
  };
};

export { getWebcamSources, nextWebcamSource };
