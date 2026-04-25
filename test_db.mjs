import { MongoClient } from 'mongodb';

async function run() {
  const uri = "***REMOVED***";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");
    // Get db test (mongoose default is usually test if not provided)
    const db = client.db('test');
    
    // Get users collection
    const users = await db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users`);
    if(users.length > 0) {
      console.log(users[0]);
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
