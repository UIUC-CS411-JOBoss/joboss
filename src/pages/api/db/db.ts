import mysql from "serverless-mysql";

require('dotenv').config();

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  },
});

const excuteQuery = async (query: string, values: any) => {
  try {
    const results = await db.query(query, values);
    return results;
  } catch (error) {
    return { error };
  }
};

export default excuteQuery;
