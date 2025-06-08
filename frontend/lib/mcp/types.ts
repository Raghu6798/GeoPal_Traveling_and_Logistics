import { z } from 'zod';

// Base schemas
export const MCPToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.object({
    type: z.string(),
    properties: z.record(z.any()),
    required: z.array(z.string())
  })
});

export const MCPToolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  arguments: z.record(z.any())
});

export const MCPMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  tool_calls: z.array(MCPToolCallSchema).optional()
});

export const MCPStateSchema = z.object({
  messages: z.array(MCPMessageSchema),
  thread_id: z.string().optional()
});

export const MCPResponseSchema = z.object({
  messages: z.array(MCPMessageSchema),
  error: z.string().optional()
});

export const MCPClientConfigSchema = z.object({
  serverUrl: z.string().url(),
  apiKey: z.string().optional(),
  onError: z.function()
    .args(z.instanceof(Error))
    .returns(z.void())
    .optional(),
  onMessage: z.function()
    .args(MCPMessageSchema)
    .returns(z.void())
    .optional()
});

// WebSocket message schemas
export const WebSocketAuthMessageSchema = z.object({
  type: z.literal('auth'),
  apiKey: z.string()
});

export const WebSocketGetToolsMessageSchema = z.object({
  type: z.literal('get_tools')
});

export const WebSocketInvokeMessageSchema = z.object({
  type: z.literal('invoke'),
  state: MCPStateSchema,
  thread_id: z.string()
});

export const WebSocketToolsResponseSchema = z.object({
  type: z.literal('tools'),
  tools: z.array(MCPToolSchema)
});

export const WebSocketResponseMessageSchema = z.object({
  type: z.literal('response'),
  thread_id: z.string(),
  messages: z.array(MCPMessageSchema),
  error: z.string().optional()
});

export const WebSocketMessageSchema = z.discriminatedUnion('type', [
  WebSocketAuthMessageSchema,
  WebSocketGetToolsMessageSchema,
  WebSocketInvokeMessageSchema,
  WebSocketToolsResponseSchema,
  WebSocketResponseMessageSchema
]);

// TypeScript types inferred from Zod schemas
export type MCPTool = z.infer<typeof MCPToolSchema>;
export type MCPToolCall = z.infer<typeof MCPToolCallSchema>;
export type MCPMessage = z.infer<typeof MCPMessageSchema>;
export type MCPState = z.infer<typeof MCPStateSchema>;
export type MCPResponse = z.infer<typeof MCPResponseSchema>;
export type MCPClientConfig = z.infer<typeof MCPClientConfigSchema>;
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

// Validation functions
export const validateMCPTool = (data: unknown): MCPTool => MCPToolSchema.parse(data);
export const validateMCPMessage = (data: unknown): MCPMessage => MCPMessageSchema.parse(data);
export const validateMCPState = (data: unknown): MCPState => MCPStateSchema.parse(data);
export const validateMCPResponse = (data: unknown): MCPResponse => MCPResponseSchema.parse(data);
export const validateWebSocketMessage = (data: unknown): WebSocketMessage => WebSocketMessageSchema.parse(data); 