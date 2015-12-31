import enumerateDevices from 'enumerate-devices';
import { pluck } from 'lodash';

const NO_OP = function(){};

const getWebcams = function( callback = NO_OP ){
  enumerateDevices().then( devices => {
    const webcams = devices.filter( device => device.kind === 'videoinput' );
    const webcam_ids = pluck( webcams, 'deviceId' );
    callback( null, webcam_ids );
  }).catch( error => {
    callback( error );
  });
};

export default getWebcams;
