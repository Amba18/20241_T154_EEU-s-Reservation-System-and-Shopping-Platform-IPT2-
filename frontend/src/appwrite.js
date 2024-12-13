import { Client,Account } from "appwrite";

const client = new Client()
    .setEndpoint('https:cloud.appwrite.io/v1')
    .setProject('674bb252001db507c1b7');

const account = new Account(client)

export{account,client}