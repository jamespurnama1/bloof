import { getDatabase, ref, push, update, child } from "firebase/database";

export default defineEventHandler(async(event) => {
  const body = await readBody(event)
  const { email } = body;

  const db = getDatabase();
  console.log(db)
  await new Promise((resolve, reject) => {
    const newKey = push(child(ref(db), 'newsletter')).key;
    const updates = {} as any;
    updates['/newsletter/' + newKey] = email;
    update(ref(db), updates)
    .then(() => resolve(true))
    .catch((err) => reject(err))
  })
})
