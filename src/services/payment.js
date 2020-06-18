import firebase from './firebase';
import mainLabs from '../config/mainLabs';

const db = firebase.firestore();

export async function getPayments(user) {
  if(user.role === 'DEV') {
    const result = await db
      .collection('payment')
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
        .collection('payment')
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
      .collection('payment')
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

export async function getApprovedPayments(user) {
  if(user.role === 'DEV') {
    const result = await db
      .collection('payment')
      .where('status', '==', 'approved')
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
        .collection('payment')
        .where('lab_id', 'in', mainLabs)
        .where('status', '==', 'approved')
        .get()
        .then(querySnapshot => {
          let data = [];
          querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
          return data;
        });

      return result.filter(u => u.id !== user.id);
    }
    const result = await db
      .collection('payment')
      .where('lab_id', '==', user.assignedTo)
      .where('status', '==', 'approved')
      .get()
      .then(querySnapshot => {
        let data = [];
        querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
        return data;
      });

    return result.filter(u => u.id !== user.id);
  }
}