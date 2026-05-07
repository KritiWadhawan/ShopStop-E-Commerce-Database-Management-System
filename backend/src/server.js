import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes      from './routes/auth.js';
import catalogRoutes   from './routes/catalog.js';
import cartRoutes      from './routes/cart.js';
import compareRoutes   from './routes/compare.js';
import orderRoutes     from './routes/orders.js';
import sellerRoutes    from './routes/seller.js';
import addressRoutes   from './routes/addresses.js';
import reviewRoutes    from './routes/reviews.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

// quick health check
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth',      authRoutes);
app.use('/api',           catalogRoutes);     // /shops, /products, /categories, /compare/:id
app.use('/api/cart',      cartRoutes);
app.use('/api/compare',   compareRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/seller',    sellerRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews',   reviewRoutes);

// generic error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal error' });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`ShopStop API listening on http://localhost:${port}`));
