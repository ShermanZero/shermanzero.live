const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://KieranSkvortsov:Iiwarlpwwibs0!@shermanzero.sjw1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function connect() {
  await client.connect();

  const db = client.db("Journal");
  const entries = db.collection("Entries");

  const data = await entries.findOne({});

  client.close();
  return data;
}

exports.handler = async (event, context) => {
  const outputData = await connect();

  return {
    statusCode: 200,
    body: JSON.stringify({ data: outputData })
  };
};