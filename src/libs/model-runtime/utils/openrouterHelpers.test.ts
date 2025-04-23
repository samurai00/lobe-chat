import { OpenAIChatMessage } from '../types/chat';
import { buildOpenRouterMessages } from './openrouterHelpers';

describe('buildOpenRouterMessages', () => {
  it('should copy OpenAI Messages for OpenRouter', async () => {
    const messages: OpenAIChatMessage[] = [
      { content: 'You are smart', role: 'system' },
      { content: 'Hi', role: 'user' },
    ];

    const result = buildOpenRouterMessages(messages);
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { content: 'You are smart', role: 'system' },
      { content: 'Hi', role: 'user' },
    ]);
  });

  it('should copy OpenAI Messages for OpenRouter without system', async () => {
    const messages: OpenAIChatMessage[] = [
      { content: 'Hi', role: 'user' },
      { content: 'Hello', role: 'assistant' },
    ];

    const result = buildOpenRouterMessages(messages);
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { content: 'Hi', role: 'user' },
      { content: 'Hello', role: 'assistant' },
    ]);
  });

  it('should copy OpenAI Messages for OpenRouter with cache disabled', async () => {
    const messages: OpenAIChatMessage[] = [
      { content: 'You are smart', role: 'system' },
      { content: 'Hi', role: 'user' },
    ];

    const result = buildOpenRouterMessages(messages, { enabledContextCaching: false });
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { content: 'You are smart', role: 'system' },
      { content: 'Hi', role: 'user' },
    ]);
  });

  it('should correctly convert OpenAI Messages to OpenRouter Messages with caching', async () => {
    const messages: OpenAIChatMessage[] = [
      { content: 'You are smart', role: 'system' },
      { content: 'Hi', role: 'user' },
    ];

    const result = buildOpenRouterMessages(messages, { enabledContextCaching: true });
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      {
        content: [{ cache_control: { type: 'ephemeral' }, type: 'text', text: 'You are smart' }],
        role: 'system',
      },
      {
        content: [{ cache_control: { type: 'ephemeral' }, type: 'text', text: 'Hi' }],
        role: 'user',
      },
    ]);
  });

  it('should only add cache_control for system and last message', async () => {
    const messages: OpenAIChatMessage[] = [
      { content: 'You are smart', role: 'system' },
      { content: 'Hi', role: 'user' },
      { content: 'Hello', role: 'assistant' },
      { content: 'Fine', role: 'user' },
    ];

    const result = buildOpenRouterMessages(messages, { enabledContextCaching: true });
    expect(result).toHaveLength(4);
    expect(result).toEqual([
      {
        content: [{ cache_control: { type: 'ephemeral' }, type: 'text', text: 'You are smart' }],
        role: 'system',
      },
      { content: 'Hi', role: 'user' },
      { content: 'Hello', role: 'assistant' },
      {
        content: [{ cache_control: { type: 'ephemeral' }, type: 'text', text: 'Fine' }],
        role: 'user',
      },
    ]);
  });

  it('should only add cache_control for last message', async () => {
    const messages: OpenAIChatMessage[] = [
      { content: 'Hi', role: 'user' },
      { content: 'Hello', role: 'assistant' },
      { content: 'Fine', role: 'user' },
    ];

    const result = buildOpenRouterMessages(messages, { enabledContextCaching: true });
    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { content: 'Hi', role: 'user' },
      { content: 'Hello', role: 'assistant' },
      {
        content: [{ cache_control: { type: 'ephemeral' }, type: 'text', text: 'Fine' }],
        role: 'user',
      },
    ]);
  });
});
