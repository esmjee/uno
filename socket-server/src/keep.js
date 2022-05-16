// let previousId;

    // const safeJoin = currentId => {
    //     socket.leave(previousId);
    //     socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
    //     previousId = currentId;
    //     console.log(documents[currentId]);
    // }

    // socket.on('getDoc', docId => {
    //     // Document.findById(docId, (error, data) => {
    //     //     if (error) {
    //     //         console.log('getDoc', error);
    //     //         return;
    //     //     } else {
    //     //         console.log('requested doc', data);
    //     //         safeJoin(docId);
    //     //         socket.emit('document', documents[docId]);
    //     //     }
    //     // });
    //     safeJoin(docId);
    //     socket.emit('document', documents[docId]);
    // });

    // socket.on('addDoc', doc => {
    //     documents[doc.id] = doc;

    //     Document.create(doc, (error, data) => {
    //         if (error) {
    //             console.log('addDoc', error);
    //             return;
    //         } else {
    //             console.log('doc data:', data);
    //             safeJoin(doc.id);
    //             io.emit('documents', Object.keys(documents));
    //             socket.emit('document', doc);
    //         }
    //     });
    // });

    // socket.on('editDoc', doc => {
    //     Document.findByIdAndUpdate(doc.id, {
    //         $set: doc
    //     }, (error, data) => {
    //         if (error) {
    //             console.log('editDoc', error);
    //             return;
    //         } else {
    //             console.log('editted doc data:', data);
    //             documents[doc.id] = data;
    //             socket.to(doc.id).emit('document', data);
    //         }
    //     })
    // });

    // Document.find((error, data) => {
	// 	if (error) {
	// 	    console.log('connect', error);
    //         return;
	// 	} else {
    //         let docs = {};
    //         for (doc in data) {
    //             docs[data[doc].id] = data[doc];
    //         }

	// 	    io.emit('documents', Object.keys(docs));
	// 	}
	// })