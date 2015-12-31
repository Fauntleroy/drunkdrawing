const toArrayFromFirebaseSnapshot = function( snapshot ){
  var array = [];
  snapshot.forEach( snapshot_item => {
    array.push({
      ...snapshot_item.val(),
      _id: snapshot_item.key()
    });
  });
  return array;
};

export default toArrayFromFirebaseSnapshot;
