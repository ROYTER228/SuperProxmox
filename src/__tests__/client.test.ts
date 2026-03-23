import { describe, it, expect } from 'vitest';
import { SuperProxmoxClient } from '../client.js';

describe('SuperProxmoxClient', () => {
  it('should create client from config with PVE only', () => {
    const client = new SuperProxmoxClient({
      pve: { url: 'https://10.0.0.1:8006', user: 'root@pam', password: 'test' }
    });
    expect(client.pve).toBeDefined();
    expect(client.pbs).toBeUndefined();
    expect(client.pdm).toBeUndefined();
  });

  it('should create client with all services', () => {
    const client = new SuperProxmoxClient({
      pve: { url: 'https://10.0.0.1:8006', user: 'root@pam', password: 'test' },
      pbs: { url: 'https://10.0.0.2:8007', user: 'root@pam', password: 'test' },
      pdm: { url: 'https://10.0.0.3:443', user: 'admin@pdm', password: 'test' },
    });
    expect(client.pve).toBeDefined();
    expect(client.pbs).toBeDefined();
    expect(client.pdm).toBeDefined();
  });

  it('should throw on init with no services', async () => {
    const client = new SuperProxmoxClient({});
    await expect(client.init()).rejects.toThrow('No services configured');
  });

  it('should read from environment variables', () => {
    process.env.PVE_URL = 'https://test:8006';
    process.env.PVE_USER = 'testuser@pam';
    process.env.PVE_PASSWORD = 'testpass';
    const client = SuperProxmoxClient.fromEnv();
    expect(client.pve).toBeDefined();
    delete process.env.PVE_URL;
    delete process.env.PVE_USER;
    delete process.env.PVE_PASSWORD;
  });

  it('should support backward compat PROXMOX_URL', () => {
    process.env.PROXMOX_URL = 'https://legacy:8006';
    process.env.PROXMOX_PASSWORD = 'test';
    const client = SuperProxmoxClient.fromEnv();
    expect(client.pve).toBeDefined();
    delete process.env.PROXMOX_URL;
    delete process.env.PROXMOX_PASSWORD;
  });
});
