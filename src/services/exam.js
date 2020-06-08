import firebase from './firebase';

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
      return [];
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