import { useCallback, useEffect, useRef, useState } from 'react';
import { MCPClient } from '../lib/mcp/client';
import { LLMClient, LLMClientConfig, LLMMessage } from '../lib/mcp/llm-client';

interface UseLLMReturn {
  messages: LLMMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<string>;
  reset: () => Promise<void>;
}

export function useLLM(
  mcpClient: MCPClient,
  config: LLMClientConfig
): UseLLMReturn {
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const llmClientRef = useRef<LLMClient | null>(null);

  // Initialize LLM client
  useEffect(() => {
    llmClientRef.current = new LLMClient(mcpClient, config);
    return () => {
      // Cleanup if needed
    };
  }, [mcpClient, config]);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    if (!llmClientRef.current) {
      throw new Error('LLM client not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await llmClientRef.current.chat(message);
      setMessages(llmClientRef.current.getMessageHistory());
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(async () => {
    if (!llmClientRef.current) {
      throw new Error('LLM client not initialized');
    }

    try {
      setIsLoading(true);
      setError(null);
      await llmClientRef.current.reset();
      setMessages(llmClientRef.current.getMessageHistory());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset conversation');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    reset
  };
} 