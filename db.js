import sql from "mssql";

function req(name) {
  const v = process.env[name];
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`Missing/invalid env var: ${name}`);
  }
  return v.trim();
}


const config = {
  user: req("DB_USER"),
  password: req("DB_PASSWORD"),
  server: req("DB_SERVER"),      
  database: req("DB_NAME"),
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  options: {
    encrypt: true,               
    trustServerCertificate: false
  },
};


if (process.env.DB_PORT) {
  const portNum = Number(process.env.DB_PORT);
  if (!Number.isNaN(portNum)) config.port = portNum;
}

let pool;

export async function getPool() {
  if (pool?.connected) return pool;

  pool = await sql.connect(config);

  console.log("✅ Connected to Azure SQL");
  return pool;
}

export async function getUserByEmail(email) {
  const p = await getPool();

  const result = await p
    .request()
    .input("email", sql.VarChar(100), String(email).trim().toLowerCase())
    .query(`
      SELECT TOP 1 user_id, email, password_hash
      FROM dbo.UserInfo
      WHERE email = @email
    `);

  return result.recordset[0] || null;
}
