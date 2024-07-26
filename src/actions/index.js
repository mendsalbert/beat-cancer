import { Account, Databases, ID } from "appwrite";
import { client, collectionID, databaseID } from "../config";

const account = new Account(client);
const database = new Databases(client);

const createRecord = async (recordData) => {
  try {
    return database.createDocument(
      databaseID,
      collectionID,
      ID.unique(),
      recordData
    );
  } catch (error) {
    console.log(error.message);
  }
};

const getAllRecordData = async () => {
  try {
    return database.listDocuments(databaseID, collectionID);
  } catch (e) {
    console.error(e.message);
  }
};

const updateRecrod = async ({
  documentID,
  analysis_result,
  kanban_records,
}) => {
  try {
    return database.updateDocument(databaseID, collectionID, documentID, {
      analysis_result,
      kanban_records,
    });
  } catch (e) {
    console.error(e.message);
  }
};

const deleteRecord = async (documentID) => {
  try {
    return database.deleteDocument(databaseID, collectionID, documentID);
  } catch (e) {
    console.error(e.message);
  }
};

export { createRecord, getAllRecordData, updateRecrod, deleteRecord };
