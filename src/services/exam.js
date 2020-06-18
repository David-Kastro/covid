import firebase from './firebase';
import mainLabs from '../config/mainLabs';

const db = firebase.firestore();

export async function getExams(user) {
  if(user.role === 'DEV') {
    const result = await db
      .collection('exams')
      .get()
      .then(querySnapshot => {
        let data = [];
        querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
        return data;
      });

    return result;

  } else {
    if(!user.assigned) {
      const result = await db
        .collection('exams')
        .where('lab_id', 'in', mainLabs)
        .get()
        .then(querySnapshot => {
          let data = [];
          querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
          return data;
        });

      return result.filter(u => u.id !== user.id);
    }
    const result = await db
      .collection('exams')
      .where('lab_id', '==', user.assignedTo)
      .get()
      .then(querySnapshot => {
        let data = [];
        querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
        return data;
      });

    return result.filter(u => u.id !== user.id);
  }
}

export async function assignExam(id, medic, assign = true ) {
  if(!id || !medic) {
    return;
  }
  const result = await db.collection('exams').doc(id).get();

  if (!result.exists) {
    return;
  }
  return await db
    .collection('exams')
    .doc(id)
    .set({
      assigned: assign,
      assignedTo: assign ? medic : null
    }, {merge: true});
}