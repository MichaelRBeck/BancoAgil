import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('❌ Variável de ambiente MONGODB_URI não definida');
}

declare global {
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
  console.log("🧠 Inicializando cache global para conexão com MongoDB");
}

cached = globalWithMongoose._mongoose;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log("✅ Usando conexão MongoDB existente do cache");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Iniciando nova conexão com MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Conectado com sucesso ao MongoDB Atlas");
  } catch (err) {
    console.error("❌ Falha ao conectar no MongoDB Atlas:", err);
    throw err;
  }

  return cached.conn;
}

export default connectDB;
