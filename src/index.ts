import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import geminiRoutes from './routes/gemini.routes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para manejar conexiones largas y evitar socket hang up
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Configurar límites de tamaño de request
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Middleware para manejar timeouts
app.use((req, res, next) => {
  // Configurar timeout de 20 minutos para todas las rutas
  req.setTimeout(1200000); // 20 minutos
  res.setTimeout(1200000); // 20 minutos

  // Configurar headers para mantener la conexión
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=1200, max=1000');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
console.log("DESDE aqui");

  next();
});

// Middleware para logging de requests largos
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 30000) { // Log requests que toman más de 30 segundos
      console.log(`⏱️ Request lento: ${req.method} ${req.path} - ${duration}ms`);
    }
  });

  res.on('close', () => {
    const duration = Date.now() - start;
    if (duration > 30000) { // Log requests que se cierran después de 10 segundos
      console.log(`🔌 Conexión cerrada: ${req.method} ${req.path} - ${duration}ms`);
    }
  });

  next();
});

app.use(geminiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server running!', timestamp: new Date().toISOString() });
});

// Middleware para manejar errores de timeout - DEBE IR AL FINAL
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
    console.error('🔌 Error de conexión:', err.message);
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        error: 'Request timeout - La operación tardó demasiado',
        details: 'Intente nuevamente o reduzca el rango de precios'
      });
    }
    return;
  }

  console.error('❌ Error no manejado:', err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: err.message
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏱️ Timeout configurado: 20 minutos`);
});

// 🔧 CORREGIR: Configurar el servidor para manejar conexiones largas consistentemente
server.keepAliveTimeout = 1300000; // 21.5 minutos (más que request timeout)
server.headersTimeout = 1310000; // 21.8 minutos (+ 10 segundos más)
server.maxConnections = 1000; // Máximo 1000 conexiones simultáneas

// Manejar eventos del servidor
server.on('connection', (socket) => {
  console.log(`🔗 Nueva conexión establecida`);

  // 🔧 CORREGIR: Configurar el socket para mantener la conexión consistentemente
  socket.setKeepAlive(true, 60000); // 1 minuto (más frecuente)
  socket.setTimeout(1300000); // 21.5 minutos (consistente con server)

  socket.on('error', (err) => {
    console.error('🔌 Error en socket:', err.message);
  });

  socket.on('timeout', () => {
    console.log('⏰ Socket timeout');
  });

  socket.on('close', (hadError) => {
    if (hadError) {
      console.log('🔌 Socket cerrado con error');
    } else {
      console.log('🔌 Socket cerrado normalmente');
    }
  });
});

server.on('error', (err) => {
  console.error('❌ Error del servidor:', err);
});

// Manejar señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
});
