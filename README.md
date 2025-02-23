# Neo4j API with Docker Compose

## How to Run 

From the project root directory, run the following command:

```bash
docker-compose up --build
```

## URLs to Use
#### API URL: http://localhost:3000
#### Neo4j Browser URL: http://localhost:7474
#### (Neo4j Bolt connection: bolt://localhost:7687) this is inside the browser

## API Endpoints
#### 1. Create Node Endpoint
#### Endpoint:
POST http://localhost:3000/create-node
#### Description:
Bulk creates nodes in the Neo4j database.
#### Sample Request Body:
```bash
{
    "tableName": "User",
    "properties": [
        {
            "id": 1,
            "name": "Shawn Anderson",
            "email": "salvarez@hotmail.com",
            "phone": "001-736-613-9863x91243",
            "age": 33,
            "work": "Tourism officer"
        }
    ]
}

```

#### 2. Create Relationships Endpoint
#### Endpoint:
POST http://localhost:3000/create-relationships
#### Description:
Bulk creates relationships between nodes in the Neo4j database.
#### Sample Request Body:
```bash
{
  "relationships": [
    {
      "fromId": 1,
      "toId": 2,
      "type": "FRIENDS_WITH",
      "properties": {  
            "position": "Hydrographic surveyor",
            "since": 2000
     }
    }
  ]
}
```

Links to Sample json file
<br><a href="https://github.com/charles-ethicalbrand/neo4j-api/blob/main/sample_100_companies.json"> Companies </a>
<br><a href="https://github.com/charles-ethicalbrand/neo4j-api/blob/main/sample_100_posts.json"> Posts </a>
<br><a href="https://github.com/charles-ethicalbrand/neo4j-api/blob/main/sample_100_relationships.json"> Relationships </a>
<br><a href="https://github.com/charles-ethicalbrand/neo4j-api/blob/main/sample_100_users.json"> Users </a>
