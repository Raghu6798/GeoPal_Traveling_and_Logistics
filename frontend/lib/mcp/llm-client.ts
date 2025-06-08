import { z } from 'zod';
import { MCPClient } from './client';
import { 
  MCPMessage, 
  MCPState, 
  MCPTool, 
  MCPResponse,
  MCPMessageSchema,
  MCPToolSchema,
  MCPStateSchema,
  MCPResponseSchema
} from './types';

// Define the LLM message types
export const LLMMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  tool_calls: z.array(z.object({
    id: z.string(),
    name: z.string(),
    arguments: z.record(z.any())
  })).optional()
});

export type LLMMessage = z.infer<typeof LLMMessageSchema>;

// Define the LLM client configuration
export const LLMClientConfigSchema = z.object({
  model: z.string(),
  apiKey: z.string(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().positive().optional(),
  tools: z.array(MCPToolSchema).optional(),
  systemPrompt: z.string().optional()
});

export type LLMClientConfig = z.infer<typeof LLMClientConfigSchema>;

export class LLMClient {
  private mcpClient: MCPClient;
  private config: LLMClientConfig;
  private messages: LLMMessage[] = [];

  constructor(mcpClient: MCPClient, config: LLMClientConfig) {
    this.mcpClient = mcpClient;
    this.config = LLMClientConfigSchema.parse(config);
    
    // Add system prompt if provided
    if (this.config.systemPrompt) {
      this.messages.push({
        role: 'system',
        content: this.config.systemPrompt
      });
    }
  }

  private convertToMCPMessage(message: LLMMessage): MCPMessage {
    return {
      role: message.role,
      content: message.content,
      tool_calls: message.tool_calls
    };
  }

  private convertFromMCPMessage(message: MCPMessage): LLMMessage {
    return {
      role: message.role,
      content: message.content,
      tool_calls: message.tool_calls
    };
  }

  async chat(message: string): Promise<string> {
    // Add user message
    const userMessage: LLMMessage = {
      role: 'user',
      content: message
    };
    this.messages.push(userMessage);

    // Convert messages to MCP format
    const mcpState: MCPState = {
      messages: this.messages.map(this.convertToMCPMessage),
      thread_id: `thread_${Date.now()}`
    };

    try {
      // Send to MCP server
      const response = await this.mcpClient.invoke(mcpState);
      
      // Process response
      if (response.error) {
        throw new Error(response.error);
      }

      // Add assistant's response to message history
      const assistantMessages = response.messages.map(this.convertFromMCPMessage);
      this.messages.push(...assistantMessages);

      // Return the last message's content
      return assistantMessages[assistantMessages.length - 1].content;
    } catch (error) {
      // Handle tool calls if present
      const lastMessage = this.messages[this.messages.length - 1];
      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        // Execute tool calls and get results
        const toolResults = await this.executeToolCalls(lastMessage.tool_calls);
        
        // Add tool results to message history
        this.messages.push({
          role: 'assistant',
          content: JSON.stringify(toolResults)
        });

        // Continue the conversation with tool results
        return this.chat(JSON.stringify(toolResults));
      }
      
      throw error;
    }
  }

  private async executeToolCalls(toolCalls: NonNullable<LLMMessage['tool_calls']>): Promise<any[]> {
    const results = [];
    
    for (const toolCall of toolCalls) {
      const tool = this.config.tools?.find(t => t.name === toolCall.name);
      if (!tool) {
        throw new Error(`Tool ${toolCall.name} not found`);
      }

      // Execute tool call through MCP client
      const result = await this.mcpClient.invoke({
        messages: [{
          role: 'assistant',
          content: '',
          tool_calls: [{
            id: toolCall.id,
            name: toolCall.name,
            arguments: toolCall.arguments
          }]
        }],
        thread_id: `tool_${toolCall.id}`
      });

      results.push({
        tool_call_id: toolCall.id,
        name: toolCall.name,
        result: result.messages[0]?.content
      });
    }

    return results;
  }

  async reset(): Promise<void> {
    this.messages = [];
    if (this.config.systemPrompt) {
      this.messages.push({
        role: 'system',
        content: this.config.systemPrompt
      });
    }
  }

  getMessageHistory(): LLMMessage[] {
    return [...this.messages];
  }
} 