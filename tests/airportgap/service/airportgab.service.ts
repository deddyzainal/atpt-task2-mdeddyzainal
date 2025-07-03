import { APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://airportgap.com/api';

export async function getAirports(context: APIRequestContext) {
  return context.get(`${BASE_URL}/airports`);
}

export async function getAirportById(context: APIRequestContext, id: string) {
  return context.get(`${BASE_URL}/airports/${id}`);
}

export async function getDistance(context: APIRequestContext, from: string, to: string) {
  return context.post(`${BASE_URL}/airports/distance`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      from,
      to,
    },
  });
}

export async function getFavorites(context: APIRequestContext, token: string) {
  const response = await context.get(`${BASE_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export async function getFavoriteById(context: APIRequestContext, token: string, favoriteId: number) {
  const url = `${BASE_URL}/favorites/${favoriteId}`;

  const response = await context.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}


export async function addFavorite(context: APIRequestContext, token: string, airportId: string) {
  const url = `${BASE_URL}/favorites`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const form = { airport_id: airportId };

  return context.post(url, {
    headers,
    form
  });
}

export async function patchFavorite(context: APIRequestContext, token: string, favoriteId: number, note: string) {
  const url = `${BASE_URL}/favorites/${favoriteId}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const form = { note: note };

  return context.patch(url, {
    headers,
    form
  });
}


export async function deleteFavorite(context: APIRequestContext, token: string, favoriteId: number) {
  const url = `${BASE_URL}/favorites/${favoriteId}`;
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return context.delete(url, {
    headers
  });
}

export async function deleteAllFavorite(context: APIRequestContext, token: string) {
  const url = `${BASE_URL}/favorites/clear_all`;
  const headers = {
    Authorization: `Bearer ${token}`
  };

  return context.delete(url, {
    headers
  });
}

