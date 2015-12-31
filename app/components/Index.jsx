import React from 'react';
import Firebase from 'firebase';
import uuid from 'uuid';

import history from '../history';

window.firebase_ref = new Firebase('https://drunk-drawing.firebaseio.com/');
const spaces_ref = firebase_ref.child('spaces');

const Index = React.createClass({
  getInitialState: function(){
    return {};
  },
  onCreateSpaceClick: function(){
    var space_id = uuid.v4();
    spaces_ref.child( space_id ).set({
      id: space_id
    }, () => {
      history.replaceState( null, '/r/' + space_id );
    });
  },
  render: function(){
    return (
      <div className="index">
        <button type="button" onClick={this.onCreateSpaceClick}>Create Space</button>
      </div>
    );
  }
});

export default Index;
