let url1 = process.env.NODE_ENV === "development"
? "http://localhost:3000/"
: "https://joboss.netlify.app";
let url2 = process.env.BASE_URL

export const BASE_URL = url2 || url1
