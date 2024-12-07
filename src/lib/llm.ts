import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing env.ANTHROPIC_API_KEY')
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!.trim(),
});

export async function queryLLM(prompt: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error querying LLM:', error);
    throw error;
  }
}

// Test function
export async function testLLMConnection() {
  try {
    console.log('Testing LLM connection...');
    const response = await queryLLM('Hello, can you hear me?');
    console.log('LLM Response:', response);
    return response;
  } catch (error) {
    console.error('LLM Test Error:', error);
    throw error;
  }
} 