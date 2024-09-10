import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        console.log("Database connected")
        connection.isConnected = db.connections[0].readyState;
        console.log(db.connection.readyState)
        console.log(connection.isConnected)
        console.log(db)
        console.log("Database connected successfully")

    } catch (error) {
        console.error("Error connecting to database", error)
        process.exit(1)
    }

}

export default dbConnect;