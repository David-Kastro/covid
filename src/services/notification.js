import firebase from './firebase';
import mainLabs from '../config/mainLabs';

const db = firebase.database();

export async function newNotification(path, notificationCode, link) {
  const data = {
    notificationCode,
    link,
    createdAt: new Date()
  }

  const newNotificationKey = await db.ref().child(path).push().key;

  const updates = {
    [path + newNotificationKey]: data
  }

  return await db.ref().update(updates);
}

export async function removeNotification(path) {
  return await db.ref(path).remove()
}

export async function getNotifications(userData, action) {

  if( userData.role === 'MEDICO' ) {
    const userRef = db.ref(`notifications/users/${userData.id}`)
    userRef
      .on('value', function(snapshot) {
        if(!snapshot) {
          action([])
          return;
        }
        let data = [];
        snapshot.forEach(doc => {
          const path = doc.ref.path.pieces_.join('/');
          data = [...data, {id: doc.key, path, ...doc.val()}]
        });
        action(data);
      });
    return 
  }

  if(!userData.assignedTo) {
    const userRef = db.ref(`notifications/users/${userData.id}`);
    const lab1Ref = db.ref(`notifications/labs/${mainLabs[0]}`);
    const lab2Ref = db.ref(`notifications/labs/${mainLabs[1]}`);
    await userRef
      .on('value', function(snapshot) {
        if(!snapshot) {
          action([])
          return;
        }
        let data = [];
        snapshot.forEach(doc => {
          const path = doc.ref.path.pieces_.join('/');
          data = [...data, {id: doc.key, path, ...doc.val()}]
        });
        action(data);
      });

    await lab1Ref
      .on('value', function(snapshot) {
        if(!snapshot) {
          action([])
          return;
        }
        let data = [];
        snapshot.forEach(doc => {
          const path = doc.ref.path.pieces_.join('/');
          data = [...data, {id: doc.key, path, ...doc.val()}]
        });
        action(data, true);
      });

      await lab2Ref
      .on('value', function(snapshot) {
        if(!snapshot) {
          action([])
          return;
        }
        let data = [];
        snapshot.forEach(doc => {
          const path = doc.ref.path.pieces_.join('/');
          data = [...data, {id: doc.key, path, ...doc.val()}]
        });
        action(data, true);
      });
    return;
  }

  const userRef = db.ref(`notifications/users/${userData.id}`);
  const labRef = db.ref(`notifications/labs/${userData.assignedTo}`)

  await userRef
    .on('value', function(snapshot) {
      if(!snapshot) {
        action([])
        return db.ref(`notifications/users/${userData.id}`);
      }
      let data = [];
      snapshot.forEach(doc => {
        const path = doc.ref.path.pieces_.join('/');
        data = [...data, {id: doc.key, path, ...doc.val()}]
      });
      action(data);
    });

  await labRef
    .on('value', function(snapshot) {
      if(!snapshot) {
        action([])
        return db.ref(`notifications/labs/${userData.id}`);
      }
      let data = [];
      snapshot.forEach(doc => {
        const path = doc.ref.path.pieces_.join('/');
        data = [...data, {id: doc.key, path, ...doc.val()}]
      });
      action(data, true);
    });
}