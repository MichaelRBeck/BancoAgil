import mongoose from 'mongoose';

// URL de conexão com o MongoDB obtida das variáveis de ambiente
const MONGODB_URI = process.env.MONGODB_URI as string;

// Garante que a variável de ambiente está definida, senão lança erro
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Declaração de tipos globais para armazenar a conexão e a promessa do mongoose
declare global {
  // Variável global para armazenar conexão mongoose, evita múltiplas conexões em hot reload (dev)
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Cast do global para ter acesso à variável _mongoose tipada
const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

// Variável para cache da conexão mongoose
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Inicializa a variável global _mongoose, se ainda não existir
if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

// Aponta o cache para o objeto global _mongoose
cached = globalWithMongoose._mongoose;

// Função para conectar ao MongoDB, reutilizando conexões já abertas para evitar overhead
async function connectDB(): Promise<typeof mongoose> {
  // Retorna conexão já existente, se houver
  if (cached.conn) return cached.conn;

  // Cria a promessa da conexão se ainda não existir
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Desativa buffer de comandos antes da conexão estar pronta
    });
  }

  // Aguarda a conexão ser estabelecida e armazena no cache
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
