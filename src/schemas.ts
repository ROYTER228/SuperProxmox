import { z } from "zod";

// Common schemas
export const nodeSchema = z.string().min(1).regex(/^[a-zA-Z0-9\-_.]+$/, "Invalid node name");
export const vmidSchema = z.number().int().min(100).max(999999999);
export const storageNameSchema = z.string().min(1).regex(/^[a-zA-Z0-9\-_.]+$/, "Invalid storage name");

// VM creation
export const createVmSchema = z.object({
  node: nodeSchema,
  vmid: vmidSchema,
  name: z.string().min(1).max(128).optional(),
  memory: z.number().int().min(16).max(1048576).optional(),
  cores: z.number().int().min(1).max(256).optional(),
  sockets: z.number().int().min(1).max(8).optional(),
  cpu: z.string().optional(),
  ostype: z.enum(["l26", "l24", "win11", "win10", "win8", "win7", "wvista", "wxp", "w2k", "w2k8", "w2k3", "solaris", "other"]).optional(),
  bios: z.enum(["seabios", "ovmf"]).optional(),
  storage: storageNameSchema.optional(),
  diskSize: z.number().int().min(1).max(131072).optional(),
  iso: z.string().optional(),
  bridge: z.string().optional(),
  start: z.boolean().optional(),
});

// Container creation
export const createContainerSchema = z.object({
  node: nodeSchema,
  vmid: vmidSchema,
  ostemplate: z.string().min(1),
  hostname: z.string().min(1).max(63).regex(/^[a-zA-Z0-9\-]+$/).optional(),
  memory: z.number().int().min(16).max(1048576).optional(),
  swap: z.number().int().min(0).optional(),
  cores: z.number().int().min(1).max(256).optional(),
  storage: storageNameSchema.optional(),
  rootfsSize: z.number().int().min(1).max(131072).optional(),
  password: z.string().min(1).optional(),
  ip: z.string().optional(),
  gateway: z.string().optional(),
  nameserver: z.string().optional(),
  unprivileged: z.boolean().optional(),
  nesting: z.boolean().optional(),
  onboot: z.boolean().optional(),
  start: z.boolean().optional(),
});

// Firewall rule
export const firewallRuleSchema = z.object({
  node: nodeSchema,
  vmid: vmidSchema.optional(),
  vmtype: z.enum(["qemu", "lxc"]).optional(),
  action: z.enum(["ACCEPT", "DROP", "REJECT"]),
  type: z.enum(["in", "out", "group"]),
  source: z.string().optional(),
  dest: z.string().optional(),
  dport: z.string().optional(),
  proto: z.enum(["tcp", "udp", "icmp"]).optional(),
  comment: z.string().max(256).optional(),
  enable: z.number().int().min(0).max(1).optional(),
});

// Cloud-init
export const cloudInitSchema = z.object({
  node: nodeSchema,
  vmid: vmidSchema,
  ciuser: z.string().min(1).max(64).optional(),
  cipassword: z.string().optional(),
  sshkeys: z.string().optional(),
  ipconfig0: z.string().optional(),
  nameserver: z.string().optional(),
  searchdomain: z.string().optional(),
  citype: z.enum(["configdrive2", "nocloud", "opennebula"]).optional(),
});

// User creation
export const createUserSchema = z.object({
  userid: z.string().min(1).regex(/.+@.+/, "Format: user@realm"),
  password: z.string().min(5).optional(),
  comment: z.string().max(256).optional(),
  email: z.string().email().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  groups: z.string().optional(),
  enable: z.number().int().min(0).max(1).optional(),
});

// Validate and return typed data or throw
export function validate<T>(schema: z.ZodSchema<T>, data: unknown, toolName: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`[${toolName}] Validation failed: ${errors}`);
  }
  return result.data;
}
