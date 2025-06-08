import { 
  MCPClientConfig, 
  MCPMessage, 
  MCPResponse, 
  MCPState, 
  MCPTool,
  WebSocketMessage,
  validateWebSocketMessage,
  validateMCPResponse,
  WebSocketMessageSchema,
  MCPClientConfigSchema,
  WebSocketResponseMessageSchema
} from './types';

export class MCPClient {
  private ws: WebSocket | null = null;
  private config: MCPClientConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // Start with 1 second

  constructor(config: MCPClientConfig) {
    // Validate config using Zod
    this.config = MCPClientConfigSchema.parse(config);
  }

  private async establishConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.serverUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.reconnectTimeout = 1000;
          if (this.config.apiKey) {
            this.sendWebSocketMessage({
              type: 'auth',
              apiKey: this.config.apiKey
            });
          }
          resolve();
        };

        this.ws.onerror = (error) => {
          this.config.onError?.(new Error('WebSocket connection error'));
          reject(error);
        };

        this.ws.onclose = () => {
          this.handleReconnect();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Validate incoming message using Zod
            const message = validateWebSocketMessage(data);
            
            if (message.type === 'response' && this.config.onMessage) {
              // Only pass the first message to the callback
              const responseMessage = message.messages[0];
              if (responseMessage) {
                this.config.onMessage(responseMessage);
              }
            }
          } catch (error) {
            this.config.onError?.(error instanceof Error ? error : new Error('Invalid message format'));
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private sendWebSocketMessage(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }
    // Validate outgoing message using Zod
    WebSocketMessageSchema.parse(message);
    this.ws.send(JSON.stringify(message));
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectTimeout *= 2; // Exponential backoff
      setTimeout(() => this.establishConnection(), this.reconnectTimeout);
    } else {
      this.config.onError?.(new Error('Max reconnection attempts reached'));
    }
  }

  async connect(): Promise<void> {
    return this.establishConnection();
  }

  async disconnect(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async getTools(): Promise<MCPTool[]> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Get tools request timed out'));
      }, 10000);

      const messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const message = validateWebSocketMessage(data);
          
          if (message.type === 'tools') {
            clearTimeout(timeout);
            this.ws?.removeEventListener('message', messageHandler);
            resolve(message.tools);
          }
        } catch (error) {
          clearTimeout(timeout);
          this.ws?.removeEventListener('message', messageHandler);
          reject(error instanceof Error ? error : new Error('Invalid message format'));
        }
      };

      if (this.ws) {
        this.ws.addEventListener('message', messageHandler);
        this.sendWebSocketMessage({ type: 'get_tools' });
      } else {
        reject(new Error('WebSocket not connected'));
      }
    });
  }

  async invoke(state: MCPState): Promise<MCPResponse> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Invoke request timed out'));
      }, 30000);

      const messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const message = validateWebSocketMessage(data);
          
          if (message.type === 'response' && message.thread_id === state.thread_id) {
            clearTimeout(timeout);
            this.ws?.removeEventListener('message', messageHandler);
            resolve(validateMCPResponse(message));
          }
        } catch (error) {
          clearTimeout(timeout);
          this.ws?.removeEventListener('message', messageHandler);
          reject(error instanceof Error ? error : new Error('Invalid message format'));
        }
      };

      if (this.ws) {
        this.ws.addEventListener('message', messageHandler);
        this.sendWebSocketMessage({
          type: 'invoke',
          state,
          thread_id: state.thread_id ?? `thread_${Date.now()}`
        });
      } else {
        reject(new Error('WebSocket not connected'));
      }
    });
  }
} 