const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));

// Load environment variables
require('dotenv').config();
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

// Neo4j Connection
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

// API to Convert Data to Neo4j in Bulk
app.post('/create-node', async (req, res) => {
    const { tableName, properties } = req.body;

    if (!tableName || !Array.isArray(properties) || properties.length === 0) {
        return res.status(400).json({ error: "Invalid request: tableName and properties are required" });
    }

    const session = driver.session();
    const transaction = session.beginTransaction();

    try {
        // Use UNWIND for efficient batch inserts
        let query = `
            UNWIND $batch AS data
            MERGE (n:${tableName} { id: data.id })
            SET n += data
            RETURN count(n) AS insertedNodes
        `;

        await transaction.run(query, { batch: properties });

        await transaction.commit();
        res.json({ message: `✅ ${properties.length} ${tableName} nodes created successfully` });

    } catch (error) {
        await transaction.rollback();
        console.error("❌ Error creating Neo4j nodes:", error);
        res.status(500).json({ error: "Failed to create nodes in Neo4j" });

    } finally {
        await session.close();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 API running on port ${port}`));
