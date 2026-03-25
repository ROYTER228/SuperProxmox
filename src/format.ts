// Rich formatting — human-readable output instead of raw JSON

export function table(headers: string[], rows: string[][]): string {
  const cols = headers.length;
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] || '').length))
  );

  const sep = widths.map(w => '─'.repeat(w + 2)).join('┼');
  const header = headers.map((h, i) => ` ${h.padEnd(widths[i])} `).join('│');
  const body = rows.map(row =>
    row.map((cell, i) => ` ${String(cell || '').padEnd(widths[i])} `).join('│')
  ).join('\n');

  return `${header}\n${'─'.repeat(sep.length + cols - 1)}\n${body}`;
}

export function statusIcon(status: string): string {
  const map: Record<string, string> = {
    running: '🟢', stopped: '🔴', paused: '🟡', suspended: '🟡',
    online: '🟢', offline: '🔴', unknown: '⚪',
    ONLINE: '🟢', DEGRADED: '🟡', FAULTED: '🔴',
    OK: '✅', WARNING: '⚠️', CRITICAL: '❌',
  };
  return map[status] || '⚪';
}

export function progressBar(percent: number, width: number = 20): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  const color = percent > 85 ? '🔴' : percent > 70 ? '🟡' : '🟢';
  return `${color} [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent.toFixed(1)}%`;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export function formatNodeResources(data: any): string {
  const cpuPct = (data.cpu * 100);
  const memPct = data.memory?.used && data.memory?.total ? (data.memory.used / data.memory.total * 100) : 0;
  const swapPct = data.swap?.used && data.swap?.total ? (data.swap.used / data.swap.total * 100) : 0;

  let out = `## Node Resources\n\n`;
  out += `**CPU:** ${data.cpuinfo?.model || 'Unknown'}\n`;
  out += `  Cores: ${data.cpuinfo?.cores || '?'} | Sockets: ${data.cpuinfo?.sockets || '?'} | Threads: ${data.cpuinfo?.cpus || '?'}\n`;
  out += `  Usage: ${progressBar(cpuPct)}\n`;

  // Temperature if available
  if (data.cpuinfo?.['cpu-temperature'] !== undefined) {
    const temp = data.cpuinfo['cpu-temperature'];
    const tempIcon = temp > 80 ? '🔥' : temp > 60 ? '🌡️' : '❄️';
    out += `  Temp: ${tempIcon} ${temp}°C\n`;
  }

  out += `\n**Memory:** ${formatBytes(data.memory?.used || 0)} / ${formatBytes(data.memory?.total || 0)}\n`;
  out += `  ${progressBar(memPct)}\n`;

  out += `\n**Swap:** ${formatBytes(data.swap?.used || 0)} / ${formatBytes(data.swap?.total || 0)}\n`;
  out += `  ${progressBar(swapPct)}\n`;

  out += `\n**Uptime:** ${formatUptime(data.uptime || 0)}\n`;
  out += `**Load:** ${(data.loadavg || []).join(', ')}\n`;

  return out;
}

export function formatVmList(vms: any[]): string {
  if (!vms.length) return 'No VMs found.';

  const rows = vms.map(vm => [
    String(vm.vmid || vm.id || ''),
    vm.name || '—',
    `${statusIcon(vm.status)} ${vm.status}`,
    vm.cpus ? `${vm.cpus} vCPU` : '—',
    vm.maxmem ? formatBytes(vm.maxmem) : '—',
    vm.uptime ? formatUptime(vm.uptime) : '—',
  ]);

  return `**VMs (${vms.length})**\n\n` + table(['ID', 'Name', 'Status', 'CPU', 'RAM', 'Uptime'], rows);
}

export function formatContainerList(cts: any[]): string {
  if (!cts.length) return 'No containers found.';

  const rows = cts.map(ct => [
    String(ct.vmid || ct.id || ''),
    ct.name || '—',
    `${statusIcon(ct.status)} ${ct.status}`,
    ct.cpus ? `${ct.cpus} vCPU` : '—',
    ct.maxmem ? formatBytes(ct.maxmem) : '—',
    ct.uptime ? formatUptime(ct.uptime) : '—',
  ]);

  return `**Containers (${cts.length})**\n\n` + table(['ID', 'Name', 'Status', 'CPU', 'RAM', 'Uptime'], rows);
}

export function formatStorageList(storage: any[]): string {
  if (!storage.length) return 'No storage found.';

  const rows = storage.map(s => {
    const pct = s.total ? (s.used / s.total * 100) : 0;
    return [
      s.storage || s.name || '—',
      s.type || '—',
      s.total ? formatBytes(s.total) : '—',
      s.used ? formatBytes(s.used) : '—',
      s.total ? progressBar(pct) : '—',
      s.content || '—',
    ];
  });

  return `**Storage**\n\n` + table(['Name', 'Type', 'Total', 'Used', 'Usage', 'Content'], rows);
}

export function formatNodeList(nodes: any[]): string {
  if (!nodes.length) return 'No nodes found.';

  const rows = nodes.map(n => {
    const cpuPct = n.cpu ? (n.cpu * 100) : 0;
    const memPct = n.maxmem ? (n.mem / n.maxmem * 100) : 0;
    return [
      n.node || n.name || '—',
      `${statusIcon(n.status)} ${n.status}`,
      cpuPct ? `${cpuPct.toFixed(1)}%` : '—',
      n.maxmem ? `${formatBytes(n.mem || 0)} / ${formatBytes(n.maxmem)}` : '—',
      n.uptime ? formatUptime(n.uptime) : '—',
    ];
  });

  return `**Nodes (${nodes.length})**\n\n` + table(['Node', 'Status', 'CPU', 'Memory', 'Uptime'], rows);
}
