import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Tipos globais
declare global {
  // Isso evita conflitos em dev/hot reload
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

cached = globalWithMongoose._mongoose;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
