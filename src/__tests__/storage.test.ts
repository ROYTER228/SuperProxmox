import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/storage.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Storage Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should list storage on node', async () => {
    await handle(client, 'pve_list_storage', { node: 'pve1' });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/storage');
  });

  it('should list cluster storage when no node', async () => {
    await handle(client, 'pve_list_storage', {});
    expect(client.get).toHaveBeenCalledWith('/storage');
  });

  it('should create NFS storage', async () => {
    await handle(client, 'pve_create_storage', {
      storage: 'nfs-backup', type: 'nfs', server: '10.0.0.5',
      export_path: '/backup', content: 'backup'
    });
    expect(client.post).toHaveBeenCalledWith('/storage', expect.objectContaining({
      storage: 'nfs-backup', type: 'nfs', server: '10.0.0.5',
      export: '/backup', content: 'backup'
    }));
  });

  it('should delete volume with correct path', async () => {
    await handle(client, 'pve_delete_volume', { node: 'pve1', storage: 'local', volume: 'local:iso/old.iso' });
    expect(client.del).toHaveBeenCalledWith('/nodes/pve1/storage/local/content/local:iso/old.iso');
  });
});
