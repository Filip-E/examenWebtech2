function(doc) {
  if (doc._id != '_design/app') {
    emit(doc.actor, doc.movies);
  }
};