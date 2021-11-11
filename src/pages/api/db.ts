import mysql from "serverless-mysql";
/* Marouane Reda. (2021, Aug 12). How to use MySQL database in Next.js apps. SimpleNextjs. https://www.simplenextjs.com/posts/next-mysql. */
const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});
export default async function excuteQuery({
  query,
  values,
}: {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
}) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}
