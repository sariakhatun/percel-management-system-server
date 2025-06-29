const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.50gybqn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    let db = client.db('parcelDB');
    let parcelCollection = db.collection('parcels')


    // app.get('/parcels',async(req,res)=>{
    //     let parcels = await parcelCollection.find().toArray();
    //     res.send(parcels)
    // })

    app.get("/parcels", async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    const query = userEmail ? { userEmail: userEmail } : {}; // ✅ filter if email exists
    const options = {
      sort: { createdAt: -1 } // ✅ sort latest first
    };

    const parcels = await parcelCollection.find(query, options).toArray();
    res.send(parcels);
  } catch (err) {
    console.error("❌ GET /parcels error:", err);
    res.status(500).send({ error: "Failed to fetch parcels", message: err.message });
  }
});


    app.post("/parcels", async (req, res) => {
      const newParcel = req.body;
      const result = await parcelCollection.insertOne(newParcel);
      res.send(result);
    });
    

app.delete('/parcels/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await parcelCollection.deleteOne({ _id: new ObjectId(id) });

   
    res.send(result);
  } catch (error) {
    console.error('Error deleting parcel:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

    

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


// Root route
app.get("/", (req, res) => {
  res.send("Parcel Management Server is Running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
