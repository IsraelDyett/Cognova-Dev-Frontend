import { Client, Databases, Account } from "appwrite";
import { cookies } from "next/headers";
const appwriteClient = new Client();

appwriteClient
  // .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost:9012/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "cognova-ai");

async function createSessionClient() {
  const session = cookies().get("session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  appwriteClient.setSession(session.value);

  return {
    get account() {
      return new Account(appwriteClient);
    },
  };
}

export default appwriteClient;

const account = new Account(appwriteClient);
const database = new Databases(appwriteClient);
export { account, database, createSessionClient };
