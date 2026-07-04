const express = require("express");
const { Client } = require("pg");

const app = express();
const PORT = 3000;

const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "password123",
    database: process.env.DB_NAME || "myapp"
});

async function connectDatabase() {
    while (true) {
        try {
            await client.connect();
            console.log("✅ Berhasil terhubung ke PostgreSQL");
            break;
        } catch (err) {
            console.log("⏳ PostgreSQL belum siap, mencoba lagi dalam 5 detik...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

async function initializeDatabase() {
    await client.query(`
        CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
    `);

    const result = await client.query("SELECT COUNT(*) FROM students");

    if (parseInt(result.rows[0].count) === 0) {
        await client.query(`
            INSERT INTO students(name)
            VALUES
            ('Muhammad Saoki Ramada'),
            ('Docker DevOps'),
            ('PostgreSQL');
        `);
    }
}

app.get("/", async (req, res) => {
    const result = await client.query("SELECT * FROM students ORDER BY id");

    let html = `
    <h1>Hello DevOps!</h1>
    <h2>Database PostgreSQL Berhasil Terhubung</h2>

    <h3>Daftar Data</h3>

    <ul>
    `;

    result.rows.forEach(row => {
        html += `<li>${row.id}. ${row.name}</li>`;
    });

    html += "</ul>";

    res.send(html);
});

connectDatabase()
    .then(async () => {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    });