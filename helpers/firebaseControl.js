import { format } from 'date-fns';
import { getAuth } from 'firebase/auth';
import { app, realTimeDb } from '../firebase';
import { db } from '../firebase';
import { storage } from '../firebase';
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

export const auth = getAuth(app);

export async function getCollection(collection) {
  return new Promise(function (resolve, reject) {
    db.collection(collection)
      .orderBy('dateCreating')
      .get()
      .then(res => {
        const data = [];
        res.forEach(doc => {
          data.push({
            idPost: doc.id,
            ...doc.data(),
          });
        });
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function getTitleOfPosts(col, locale) {
  return new Promise(function (resolve) {
    db.collection(col).onSnapshot(function (snapshot) {
      const titles = [];
      snapshot.docs.forEach(el =>
        titles.push([
          el._delegate._document.data.value.mapValue.fields[locale].mapValue
            .fields.title.stringValue,
          el._delegate._document.data.value.mapValue.fields.type.stringValue,
          el._delegate._document.data.value.mapValue.fields.path.stringValue,
        ])
      );
      resolve(titles);
    });
  }).catch(err => {
    alert(err);
  });
}

export async function getTitleOfServices(locale) {
  return new Promise(function (resolve) {
    db.collection('services').onSnapshot(function (snapshot) {
      const titles = [];
      snapshot.docs.forEach(el =>
        titles.push([
          `${el._delegate._document.data.value.mapValue.fields.serviceType.mapValue.fields[locale].stringValue}: ${el._delegate._document.data.value.mapValue.fields[locale].mapValue.fields.title.stringValue}`,
          el._delegate._document.data.value.mapValue.fields.type.stringValue,
          el._delegate._document.data.value.mapValue.fields.path.stringValue,
        ])
      );
      resolve(titles);
    });
  }).catch(err => {
    alert(err);
  });
}

export function updateDocumentInCollection(collection, document, idDocumnent) {
  return new Promise(function (resolve, reject) {
    try {
      db.collection(collection)
        .doc(idDocumnent)
        .update(document)
        .then(r => {
          resolve({ result: r });
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function setDocumentToCollection(collection, document) {
  return new Promise(function (resolve, reject) {
    try {
      db.collection(collection)
        .add(document)
        .then(r => {
          updateDocumentInCollection(
            collection,
            { ...document, idPost: r.id },
            r.id
          )
            .then(res => console.log('success'))
            .catch(e => console.log(e));
          resolve({ result: r });
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getCollectionWhereKeyValue(collection, key, value) {
  return new Promise(function (resolve, reject) {
    db.collection(collection)
      .where(key, '==', value)
      .get()
      .then(res => {
        const data = [];
        res.forEach(doc => {
          data.push({
            ...doc.data(),
            idPost: doc.id,
          });
        });
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function createNewUser(user, regInfo) {
  return new Promise(function (resolve, reject) {
    const user_to_firebase_start = {
      uid: user?.uid,
      email: user?.email || '',
      phoneNumber: regInfo?.phoneNumber || '',
      dateCreating: format(new Date(), 'dd-MM-yyyy HH:mm'),
      role: 'user',
      requests: [
        // {
        //   id,
        //   dateCreating: format(new Date(), 'dd-MM-yyyy HH:mm'),
        //   title,
        //   pdfDoc,
        //   numberOrder,
        // },
      ],
    };
    setDocumentToCollection('users', user_to_firebase_start)
      .then(r => {
        console.log('user saved in DB');
        resolve(r);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export async function updateFieldInDocumentInCollection(
  collection,
  docId,
  fieldName,
  newValue
) {
  let result;

  try {
    const docRef = db.collection(collection).doc(docId);
    result = await docRef.update({ [fieldName]: newValue });
  } catch (error) {
    console.log(error.message);
  }

  return result;
}

export function removeDocumentFromCollection(collection, docId) {
  return new Promise(function (resolve, reject) {
    try {
      db.collection(collection)
        .doc(docId)
        .delete()
        .then(r => {
          resolve(r);
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function uploadFileToStorage(file, id, postInfo) {
  return new Promise(function (resolve, reject) {
    storage
      .ref(`${id}`)
      .put(file)
      .then(res => {
        storage
          .ref()
          .child(id)
          .getDownloadURL()
          .then(r => {
            updateFieldInDocumentInCollection(
              `${postInfo.type}`,
              id,
              'image',
              r
            );
            console.log('updateUrl');
          })
          .catch(er => {
            alert(er);
          });
        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function deleteImageFromStorage(image) {
  return new Promise(function (resolve, reject) {
    deleteObject(ref(storage, image))
      .then(r => {
        resolve(r);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function createNewPost(postInfo, file, type, serviceType) {
  const id = Math.floor(Date.now() * Math.random()).toString();
  return new Promise(function (resolve, reject) {
    const post_to_firebase =
      type === 'services'
        ? {
            id,
            image: '',

            ua: {
              title: postInfo.ua.title || '',
              text: postInfo.ua.text || '',
            },

            ru: {
              title: postInfo.ru.title || '',
              text: postInfo.ru.text || '',
            },
            en: {
              title: postInfo.en.title || '',
              text: postInfo.en.text || '',
            },

            path: postInfo.path.length > 0 ? postInfo.path : id,
            type: postInfo.type,
            serviceType,
            dateCreating: format(new Date(), 'yyyy-MM-dd HH:mm'),
          }
        : {
            id,
            image: '',

            ua: {
              title: postInfo.ua.title || '',
              preview: postInfo.ua.preview || '',
              text: postInfo.ua.text || '',
            },
            ru: {
              title: postInfo.ru.title || '',
              preview: postInfo.ru.preview || '',
              text: postInfo.ru.text || '',
            },
            en: {
              title: postInfo.en.title || '',
              preview: postInfo.en.preview || '',
              text: postInfo.en.text || '',
            },

            path: postInfo.path.length > 0 ? postInfo.path : id,
            type: postInfo.type,
            dateCreating: format(new Date(), 'yyyy-MM-dd HH:mm'),
          };

    setDocumentToCollection(`${postInfo.type}`, post_to_firebase)
      .then(r => {
        if (file) {
          uploadFileToStorage(file, r.result.id, postInfo);
        }

        console.log('post saved in DB');

        resolve(r);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export const saveRequestToFirestore = async (db, uid, data, pdfBase64) => {
  const userRef = doc(db, 'users', uid);
  console.log('saveRequestToFirestore ~ userRef:', userRef);

  // Перевіряємо, чи існує документ
  const docSnapshot = await getDoc(userRef);
  if (!docSnapshot.exists()) {
    throw new Error(`Користувач із UID ${uid} не знайдений.`);
  }
  // Створюємо user, якщо його немає
  // await setDoc(userRef, {
  //   uid: user?.uid,
  //   name: duserata.name || '',
  //   dateCreating: format(new Date(), 'yyyy-MM-dd HH:mm'),
  //   email: user.email || '',
  //   phoneNumber: user?.phoneNumber || '',
  //   requests: [],
  //   role: 'user',
  // });
  // }

  // Формуємо новий запит
  const newRequest = {
    id: Math.floor(Date.now() * Math.random()).toString(),
    dateCreating: data.dateCreating || format(new Date(), 'yyyy-MM-dd HH:mm'),
    title: data.title || 'Запит',
    pdfDoc: pdfBase64,
    numberOrder: data.numberOrder || '',
  };

  // Оновлюємо поле `requests` користувача
  await updateDoc(userRef, {
    requests: arrayUnion(newRequest),
  });

  return newRequest;
};

export const uploadPDFToStorage = async (pdfBuffer, fileName) => {
  const storageRef = ref(storage, fileName);

  try {
    // Завантажуємо PDF у Firebase Storage
    await uploadBytes(storageRef, pdfBuffer, {
      contentType: 'application/pdf',
    });

    // Отримуємо публічний URL для завантаженого файлу
    const fileUrl = await getDownloadURL(storageRef);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading PDF to Storage:', error);
    throw error;
  }
};
