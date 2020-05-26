import firebase from './firebase';

const db = firebase.firestore();

export async function create(data, user) {
  const result = await db.collection('users').where('email', '==', data.email).get();
  if (!result.empty) {
    throw Error('Já existe um usuário cadastrado com esse email!');
  }
  let userData = {
    ...user,
    assignedTo: user.assignedTo || null,
    assigned: user.assigned
  };
  return await db.collection('users').add(userData);
}

export async function save(data) {
  const result = await db.collection('users').doc(data.id).get();
  if (!result.exists) {
    throw Error('Usuário não encontrado');
  }
  return await db.collection('users').doc(data.id).set(data);
}

export async function list(user) {
  if(user.role === 'DEV') {
    const result = await db
      .collection('users')
      .where('role', 'in', ['ADMIN', 'MEDICO'])
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
      .collection('users')
      .where('role', 'in', ['ADMIN', 'MEDICO'])
      .where('assignedTo', '==', user.assignedTo)
      .get()
      .then(querySnapshot => {
        let data = [];
        querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
        return data;
      });

    return result.filter(u => u.id !== user.id);
  }
}

export async function listByRole(role) {
  const result = await db
    .collection('users')
    .where('role', '==', role)
    .get()
    .then(querySnapshot => {
      let data = [];
      querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
      return data;
    });

  return result;
}

export async function listByEmail(email) {
  const result = await db
    .collection('users')
    .where('email', '==', email)
    .get()
    .then(querySnapshot => {
      let data = [];
      querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
      return data[0];
    });

  return result;
}

export async function listById(id) {
  const result = await db
    .collection('users')
    .doc(id)
    .get();

  return result.data();
}

export async function assignUser(id, assign = true, lab = null) {
  if(!id) {
    return;
  }
  const result = await db.collection('users').doc(id).get();

  if (!result.exists) {
    return;
  }
  return await db
    .collection('users')
    .doc(id)
    .set({
      assigned: assign,
      assignedTo: assign ? lab : null
    }, {merge: true});
}