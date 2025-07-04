import { test, expect } from '@playwright/test';
import { AirportGabService } from '../service/airportgab.service';
import { createAuthContext } from '../context/api.context';

test.describe('Airport Gap API Tests', () => {
  const getAirportService = new AirportGabService();

  test('GET /airports', async () => {
    const { data, status } = await getAirportService.getAirports();
    expect(data).toBeTruthy();
    expect(status).toBe(200);
  });

  test('GET /airports/{id}', async () => {
    const { data, status } = await getAirportService.getAirportById('GKA');
    expect(data).toBeTruthy();
    expect(status).toBe(200);
    expect(data.data.id).toBe('GKA');
  });

  test('POST /airports/distance', async () => {
    const { data, status } = await getAirportService.getDistance('KIX', 'NRT');
    expect(data).toBeTruthy();
    expect(status).toBe(200);
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

    test.beforeAll(async () => {
      const auth = await createAuthContext();
      token = auth.token;
      await getAirportService.deleteAllFavorite(token);
    });

    test('POST /favorites', async () => {
      const { data, status } = await getAirportService.addFavorite(token, 'GKA');
      expect(status).toBe(201);
      expect(data).toBeTruthy();

      favoriteId = data.data.id;
      expect(data.data.attributes.airport.iata).toEqual('GKA');
    });

    test('PATCH /favorites', async () => {
      const { data, status } = await getAirportService.patchFavorite(token, favoriteId, 'Test note');
      expect(status).toBe(200);
      expect(data.data.attributes.note).toEqual('Test note');
    });

    test('GET /favorites', async () => {
      const { data, status } = await getAirportService.getFavorites(token);
      expect(status).toBe(200);
      expect(data).toBeTruthy();
    });

    test('GET /favorites/{id}', async () => {
      const { data, status } = await getAirportService.getFavoriteById(token, favoriteId);
      expect(status).toBe(200);
      expect(data.data.attributes.airport.iata).toEqual('GKA');
    });

    test('DELETE /favorites/{id}', async () => {
      const { status } = await getAirportService.deleteFavorite(token, favoriteId);
      expect(status).toBe(204);
    });

    test('DELETE /favorites/clear_all', async () => {
      const { status } = await getAirportService.deleteAllFavorite(token);
      expect(status).toBe(204);
    });
  });
});
