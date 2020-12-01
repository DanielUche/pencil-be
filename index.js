const { MongoClient } = require('mongodb');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const {DB_CONNECTION_STRING, SHEET_KEY, SHEET_ID } =  process.env;

const doc = new GoogleSpreadsheet(SHEET_ID);
const client = new MongoClient(DB_CONNECTION_STRING,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
const sheetHeaders = [
  'Question number', 'Annotation 1',
  'Annotation 2', 'Annotation 3',
  'Annotation 4', 'Annotation 5',
];

const topicHeaders = [
  'Topic Level 1', 'Topic Level 2', 'Topic Level 3'
];

doc.useApiKey(SHEET_KEY);

const databaseConnection = async () => {
  await client.connect();
  console.log("Connection Successfull");
}

const prepQuestionsDocs = async () => {
  const rowSet = [];
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  rows.forEach((row) => {
    const data = {};
    data['_id'] = row[sheetHeaders[0]]
    data['ancestors'] = [];
    for (i = 1; i < sheetHeaders.length; i++) {
      if (row[sheetHeaders[i]]) {
        data['ancestors'].push(row[sheetHeaders[i]])
      }
    }
    data['parent'] = row[sheetHeaders[1]];
    rowSet.push(data);
  });
  return rowSet;
}

const prepTopicsDocs = async () => {
  const treeParent = new Set();
  const rowSet = [];
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[1];
  const rows = await sheet.getRows();
  let _id = 1;
  rows.forEach((row) => {
    let data;
    if (!treeParent.has(row[topicHeaders[0]])) {
      data = {};
      data['_id'] = _id;
      data['topic'] = row[topicHeaders[0]];
      data['ancestors'] = [];
      data['parent'] = null;
      rowSet.push(data);
      _id += 1;
      for (i = 1; i < 3; i++) {
        data = {};
        if (row[topicHeaders[i]]) {
          data['_id'] = _id;
          data['topic'] = row[topicHeaders[i]];
          data['ancestors'] = [...Array(i).keys()].map((d) => row[topicHeaders[d]]);
          data['parent'] = row[topicHeaders[i - 1]];
          rowSet.push(data);
          _id += 1;
        }
      }
      treeParent.add(row[topicHeaders[0]]);
    } else {
      for (i = 1; i < 3; i++) {
        data = {};
        if (row[topicHeaders[i]]) {
          data['_id'] = _id;
          data['topic'] = row[topicHeaders[i]];
          data['ancestors'] = [...Array(i).keys()].map((d) => row[topicHeaders[d]]);
          data['parent'] = row[topicHeaders[i - 1]];
          rowSet.push(data);
          _id += 1;
        }
      }
    }

  });
  return rowSet;
}


const insertDoc = async (docs, collection, msg) => {
  const result = await client.db("pencil-db")
    .collection(collection)
    .insertMany(docs);
  console.log(
    `${result.insertedCount} new ${msg}(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
}


(async () => {
  try {
    await databaseConnection();
    const questions = await prepQuestionsDocs();
    await insertDoc(questions, 'questions', 'question');
    const topics =  await prepTopicsDocs();
    await insertDoc(topics, 'topics', 'topic');
  } catch (error) {
    console.log(error);
  }
})().then(() => process.exit(0));




