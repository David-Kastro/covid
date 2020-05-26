import firebase from './firebase';
import { assignUser } from './user';

const db = firebase.firestore();

export async function create(data) {
  const result = await db.collection('labs').where('cnpj', '==', data.cnpj).get();
  if (!result.empty) {
    throw Error('Já existe um laboratório cadastrado com esse cnpj!');
  }
  const newLab = await db.collection('labs').add(data);
  await assignUser(data.adm, true, newLab.id);
  return newLab;
}

export async function save(data) {
  const result = await db.collection('labs').doc(data.id).get();
  if (!result.exists) {
    throw Error('Laboratório não encontrado');
  }
  const lab = result.data();
  if (lab.adm !== data.adm) {
    await assignUser(lab.adm, false);
    await assignUser(data.adm, true, result.id);
  }
  return await db.collection('labs').doc(data.id).set(data);
}

export async function list() {
  const result = await db
    .collection('labs')
    .get()
    .then(querySnapshot => {
      let data = [];
      querySnapshot.forEach(doc => {data = [...data, {id: doc.id, ...doc.data()}]});
      return data;
    });

  return result;
}