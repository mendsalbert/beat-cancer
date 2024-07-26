import { Client } from "appwrite";

const collectionID = "6679ea55000e31c505bb"; // your collection ID
const databaseID = "6679be830030a4adb8da"; // Your database ID
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // We set the endpoint, change this if your using another endpoint URL.
  .setProject("667499d4002a29e6a15e"); // Here replace 'ProjectID' with the project ID that you created in your appwrite installation.

export { client, collectionID, databaseID }; // Finally export the client to be used in projects.
