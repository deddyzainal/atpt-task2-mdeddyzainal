import { APIRequestContext, request } from '@playwright/test';

const BASE_URL = 'https://airportgap.com/api';

export class AirportGabService {
  async getAirports() {
    try {
      const context = await request.newContext();
      const response = await context.get(`${BASE_URL}/airports`);

      const data = await response.json();
      const status = response.status();

      return {
        data: data,
        status: status
      };
    } catch (e) {
      throw e;
    }
  }

  async getAirportById(id: string) {
    try {
      const context = await request.newContext();
      const response = await context.get(`${BASE_URL}/airports/${id}`);

      const data = await response.json();
      const status = response.status();

      return { data, status };
    } catch (e) {
      throw e;
    }
  }

  async getDistance(from: string, to: string) {
    try {
      const context = await request.newContext();
      const response = await context.post(`${BASE_URL}/airports/distance`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          from,
          to,
        },
      });

      const data = await response.json();
      const status = response.status();

      return { data, status };
    } catch (e) {
      throw e;
    }
  }

  async getFavorites(token: string) {
    try {
      const context = await request.newContext();
      const response = await context.get(`${BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const status = response.status();

      return { data, status };
    } catch (e) {
      throw e;
    }
  }

  async getFavoriteById(token: string, favoriteId: number) {
    try {
      const context = await request.newContext();
      const response = await context.get(`${BASE_URL}/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const status = response.status();

      return { data, status };
    } catch (e) {
      throw e;
    }
  }

  async addFavorite(token: string, airportId: string) {
    try {
      const context = await request.newContext();
      const response = await context.post(`${BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          airport_id: airportId,
        },
      });

      const data = await response.json();
      const status = response.status();

      return { data, status };
    } catch (e) {
      throw e;
    }
  }

  async patchFavorite(token: string, favoriteId: number, note: string) {
    try {
      const context = await request.newContext();
      const response = await context.patch(`${BASE_URL}/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          note: note,
        },
      });

      const data = await response.json();
      const status = response.status();

      return { data, status };
    } catch (e) {
      throw e;
    }
  }

  async deleteFavorite(token: string, favoriteId: number) {
    try {
      const context = await request.newContext();
      const response = await context.delete(`${BASE_URL}/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const status = response.status();
      return { status };
    } catch (e) {
      throw e;
    }
  }

  async deleteAllFavorite(token: string) {
    try {
      const context = await request.newContext();
      const response = await context.delete(`${BASE_URL}/favorites/clear_all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const status = response.status();
      return { status };
    } catch (e) {
      throw e;
    }
  }
}
