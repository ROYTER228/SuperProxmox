import { vi } from 'vitest';
import { ApiClient } from '../client.js';

export function createMockClient(): ApiClient {
  const client = Object.create(ApiClient.prototype) as ApiClient;

  (client as any).api = {};
  (client as any).service = 'pve';

  client.get = vi.fn().mockResolvedValue({});
  client.post = vi.fn().mockResolvedValue('UPID:test:000');
  client.put = vi.fn().mockResolvedValue(null);
  client.del = vi.fn().mockResolvedValue('UPID:test:000');

  return client;
}

export function mockGetReturn(client: ApiClient, data: any) {
  (client.get as any).mockResolvedValueOnce(data);
}

export function mockPostReturn(client: ApiClient, data: any) {
  (client.post as any).mockResolvedValueOnce(data);
}

export function mockGetReject(client: ApiClient, status: number, message: string) {
  (client.get as any).mockRejectedValueOnce({
    response: { status, data: { errors: message } }
  });
}
