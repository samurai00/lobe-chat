import { OpenAIChatMessage } from '@/libs/model-runtime';

export const buildOpenRouterMessages = (
  oaiMessages: OpenAIChatMessage[],
  options: { enabledContextCaching?: boolean } = {},
): OpenAIChatMessage[] => {
  if (!options.enabledContextCaching) {
    return oaiMessages;
  }

  const messages: OpenAIChatMessage[] = [];

  const systemMessage = oaiMessages.find((m) => m.role === 'system');
  const userMessages = oaiMessages.filter((m) => m.role !== 'system');

  if (!!systemMessage?.content) {
    messages.push({
      ...systemMessage,
      content: [
        {
          cache_control: { type: 'ephemeral' },
          text: systemMessage?.content as string,
          type: 'text',
        },
      ],
    });
  }

  for (const message of userMessages) {
    messages.push(message);
  }

  const lastMessage = messages.at(-1);
  if (!!lastMessage) {
    if (typeof lastMessage.content === 'string') {
      lastMessage.content = [
        {
          cache_control: { type: 'ephemeral' },
          text: lastMessage.content as string,
          type: 'text',
        },
      ];
    } else {
      const lastContent = lastMessage.content.at(-1);
      if (lastContent && lastContent.type === 'text') {
        lastContent.cache_control = { type: 'ephemeral' };
      }
    }
  }

  return messages;
};
