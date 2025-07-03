import { request, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://airportgap.com/api';
const EMAIL = 'deddy.zainal@fintopia.tech';
const PASSWORD = 'airportgappassword';


export async function createAuthContext(): Promise<{ token: string; context: APIRequestContext }> {
  const context = await request.newContext();

  const response = await context.post(`${BASE_URL}/tokens`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      email: EMAIL,
      password: PASSWORD,
    },
  });

  if (!response.ok()) {
    throw new Error(`Auth failed: ${response.status()} - ${await response.text()}`);
  }

  const data = await response.json();
  return {
    token: data.token,
    context,
  };
}
