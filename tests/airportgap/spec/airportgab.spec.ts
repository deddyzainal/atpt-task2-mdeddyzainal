import { test, expect, APIRequestContext } from '@playwright/test';
import {
  getAirports,
  getAirportById,
  getDistance,
  getFavorites,
  addFavorite,
  patchFavorite,
  deleteFavorite,
  getFavoriteById,
  deleteAllFavorite,
} from '../service/airportgab.service';
import { createAuthContext } from '../context/api.context';

test.describe('Airport Gap API Tests', () => {
    test('GET /airports', async ({ request }) => {
        const response = await getAirports(request);
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(Array.isArray(data.data)).toBeTruthy();
    });

    test('GET /airports/{id}', async ({ request }) => {
        const response = await getAirportById(request, 'GKA');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.id).toBe('GKA');
    });
    
    test('POST /airports/distance', async ({ request }) => {
        const response = await getDistance(request, 'KIX', 'NRT');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.data.attributes.kilometers).toBeGreaterThan(0);
        });

    test('POST /tokens', async () => {
        const { token } = await createAuthContext();

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(10);
    });

  test.describe.serial('Authorized requests', () => {
    let token: string;
    let favoriteId: number;
    let context: APIRequestContext;

    test.beforeAll(async () => {
      const auth = await createAuthContext();
      token = auth.token;
      context = auth.context;
      await deleteAllFavorite(context, token);
    });

    test('POST /favorites', async () => {  
      const response = await addFavorite(context, token, 'GKA');      
      const data = await response.json();
      expect(response.status()).toBe(201);
      expect(response.ok()).toBeTruthy();
      
      favoriteId = data.data.id;
      expect(data.data.attributes.airport.iata).toEqual('GKA');
    });

    test('PATCH /favorites', async () => {  
      const response = await patchFavorite(context, token, favoriteId, 'Test note');      
      const data = await response.json();
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
      
      expect(data.data.attributes.note).toEqual('Test note');
    });

    test('GET /favorites', async () => {
      const response = await getFavorites(context, token);
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });

    test('GET /favorites/{id}', async () => {
        const response = await getFavoriteById(context, token, favoriteId);
        const data = await response.json();
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();

        expect(data.data.attributes.airport.iata).toEqual('GKA');
    });

    test('DELETE /favorites/{id}', async () => {
      const response = await deleteFavorite(context, token, favoriteId);
      expect(response.status()).toBe(204);
    });

    test('DELETE /favorites/clear_all', async () => {
      const response = await deleteAllFavorite(context, token);
      expect(response.status()).toBe(204);
    });
  });
});
