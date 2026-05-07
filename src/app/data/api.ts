/**
 * Thin REST client for the ShopStop backend.
 *
 * NOTE: Adding this file does NOT change any existing UI component.
 * The current components still import their data from `mockData.ts`.
 * Use the helpers below if/when you want to switch a screen to live
 * data from the database — see backend/README.md "Frontend integration".
 */

const BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'shopstop_token';

export const auth = {
  token() { return localStorage.getItem(TOKEN_KEY); },
  setToken(t: string | null) {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  },
};

async function http<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> || {}),
  };
  const t = auth.token();
  if (t) headers.Authorization = `Bearer ${t}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as any) : res.json();
}

// ----------------------- AUTH ---------------------------------------
export const api = {
  // Auth
  login: (email: string, password: string) =>
    http<{ token: string; user: any }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }).then(d => { auth.setToken(d.token); return d.user; }),

  register: (payload: { name: string; email: string; phone: string; password: string; role?: 'buyer'|'seller' }) =>
    http<{ token: string; user: any }>('/auth/register', {
      method: 'POST', body: JSON.stringify(payload),
    }).then(d => { auth.setToken(d.token); return d.user; }),

  me:     () => http('/auth/me'),
  logout: () => { auth.setToken(null); },

  // Catalog
  categories: ()                              => http('/categories'),
  shops:      (lat?: number, lon?: number)    => http(`/shops${lat&&lon?`?lat=${lat}&lon=${lon}`:''}`),
  shop:       (id: string|number)             => http(`/shops/${id}`),
  products:   (q?: string, category?: string, shopId?: string|number) => {
    const qs = new URLSearchParams();
    if (q)        qs.set('q', q);
    if (category) qs.set('category', category);
    if (shopId)   qs.set('shopId', String(shopId));
    return http(`/products${qs.toString() ? `?${qs}` : ''}`);
  },
  listing:    (listingId: string|number)      => http(`/products/${listingId}`),
  compare:    (productId: string|number)      => http(`/compare/${productId}`),

  // Cart
  cart: {
    list:    ()                                                      => http('/cart'),
    add:     (listingId: number, quantity = 1)                       => http('/cart',  { method: 'POST',  body: JSON.stringify({ listingId, quantity }) }),
    update:  (listingId: number, quantity: number)                   => http(`/cart/${listingId}`, { method: 'PATCH',  body: JSON.stringify({ quantity }) }),
    remove:  (listingId: number)                                     => http(`/cart/${listingId}`, { method: 'DELETE' }),
    clear:   ()                                                      => http('/cart',  { method: 'DELETE' }),
  },

  // Compare list
  compareList: {
    list:    ()                       => http('/compare'),
    add:     (productId: number)      => http('/compare', { method: 'POST', body: JSON.stringify({ productId }) }),
    remove:  (productId: number)      => http(`/compare/${productId}`, { method: 'DELETE' }),
    clear:   ()                       => http('/compare', { method: 'DELETE' }),
  },

  // Orders
  orders: {
    place:        (shopId: number, addressId: number) =>
                    http<{ orderId: number }>('/orders', { method: 'POST', body: JSON.stringify({ shopId, addressId }) }),
    listMine:     ()                  => http('/orders'),
    detail:       (id: number)        => http(`/orders/${id}`),
    updateStatus: (id: number, status: string, message?: string) =>
                    http(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, message }) }),
  },

  // Addresses
  addresses: {
    list: () => http('/addresses'),
    add:  (a: any) => http('/addresses', { method: 'POST', body: JSON.stringify(a) }),
  },

  // Reviews
  reviews: {
    forListing: (id: number)                  => http(`/reviews/listing/${id}`),
    submit:     (listingId: number, rating: number, comment?: string) =>
                  http('/reviews', { method: 'POST', body: JSON.stringify({ listingId, rating, comment }) }),
  },

  // Seller dashboard
  seller: {
    dashboard:    ()                                  => http('/seller/dashboard'),
    orders:       ()                                  => http('/seller/orders'),
    listings:     ()                                  => http('/seller/listings'),
    updateListing:(id: number, body: { price?: number; stockCount?: number }) =>
                    http(`/seller/listings/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  },
};

export default api;
