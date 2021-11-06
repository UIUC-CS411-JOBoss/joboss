import dotenv from "dotenv";
import mysql from "serverless-mysql";

dotenv.config();

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const excuteQuery = async (query: string, values: any) => {
  try {
    return await db.query(query, values);
  } catch (error) {
    return { error };
  }
};

export default excuteQuery;
