const express = require("express");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver");

const app = express();
app.use(bodyParser.json({ limit: "100mb" }));

// Load environment variables
require("dotenv").config();
const NEO4J_URI = process.env.NEO4J_URI || "bolt://localhost:7687";
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || "neo4j";
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || "password";

// Neo4j Connection
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

// API to Create Relationships in Bulk with Dynamic Relationship Types & Properties
app.post("/create-relationships", async (req, res) => {
    const { relationships } = req.body;

    if (!Array.isArray(relationships) || relationships.length === 0) {
        return res.status(400).json({ error: "Invalid request: relationships array is required" });
    }

    const session = driver.session();
    const transaction = session.beginTransaction();

    try {
        for (let rel of relationships) {
            let query = `
                MATCH (a {id: $fromId}), (b {id: $toId})
                MERGE (a)-[r:${rel.type}]->(b)
                SET r += $properties
                RETURN count(r) AS insertedRelationships
            `;

            await transaction.run(query, {
                fromId: rel.fromId,
                toId: rel.toId,
                properties: rel.properties || {}
            });
        }

        await transaction.commit();
        res.json({ message: `✅ ${relationships.length} relationships created successfully` });

    } catch (error) {
        await transaction.rollback();
        console.error("❌ Error creating relationships in Neo4j:", error);
        res.status(500).json({ error: "Failed to create relationships in Neo4j", details: error.message });
    } finally {
        await session.close();
    }
});


// Start API Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Relationship API running on port ${port}`));
