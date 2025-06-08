import { useEffect, useRef, useState, useCallback } from 'react';
import { MCPClient } from '../lib/mcp/client';
import { MCPClientConfig, MCPMessage, MCPResponse, MCPState, MCPTool } from '../lib/mcp/types';

interface UseMCPReturn {
  client: MCPClient | null;
  isConnected: boolean;
  tools: MCPTool[];
  messages: MCPMessage[];
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (content: string) => Promise<MCPResponse>;
  isLoading: boolean;
}

export function useMCP(config: MCPClientConfig): UseMCPReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [messages, setMessages] = useState<MCPMessage[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const clientRef = useRef<MCPClient | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    config.onError?.(error);
  }, [config]);

  const handleMessage = useCallback((message: MCPMessage) => {
    setMessages(prev => [...prev, message]);
    config.onMessage?.(message);
  }, [config]);

  useEffect(() => {
    clientRef.current = new MCPClient({
      ...config,
      onError: handleError,
      onMessage: handleMessage,
    });

    return () => {
      clientRef.current?.disconnect();
    };
  }, [config, handleError, handleMessage]);

  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await clientRef.current?.connect();
      const tools = await clientRef.current?.getTools() ?? [];
      setTools(tools);
      setIsConnected(true);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const disconnect = useCallback(async () => {
    try {
      await clientRef.current?.disconnect();
      setIsConnected(false);
      setTools([]);
    } catch (err) {
      handleError(err as Error);
    }
  }, [handleError]);

  const sendMessage = useCallback(async (content: string): Promise<MCPResponse> => {
    if (!clientRef.current || !isConnected) {
      throw new Error('MCP client not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const userMessage: MCPMessage = {
        role: 'user',
        content,
      };

      setMessages(prev => [...prev, userMessage]);

      const state: MCPState = {
        messages: [...messages, userMessage],
        thread_id: `user_thread_${Date.now()}`,
      };

      const response = await clientRef.current.invoke(state);
      setMessages(prev => [...prev, ...response.messages]);
      return response;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, messages, handleError]);

  return {
    client: clientRef.current,
    isConnected,
    tools,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
    isLoading,
  };
} 