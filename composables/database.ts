import { getDatabase, ref, push, update, child } from "firebase/database";

export async function pushDatabase(email: string) {
  
  const db = getDatabase();
  await new Promise((resolve, reject) => {
    const newKey = push(child(ref(db), 'newsletter')).key;
    const updates = {} as any;
    updates['/newsletter/' + newKey] = email;
    update(ref(db), updates)
    .then(() => resolve(true))
    .catch((err) => reject(err))
  })
}