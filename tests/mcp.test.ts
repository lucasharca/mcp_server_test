import { describe, it, after, before } from 'node:test';
import assert from 'node:assert';

import { Client } from '@modelcontextprotocol/sdk/client';
import { createTestClient } from './helpers.ts';

async function encryptMessage(client: Client, message: string, encryptionKey: string) {
    const result = await client.callTool({
        name: 'encryptMessage',
        arguments: {
            message,
            encryptionKey
        }
    }) as unknown as { structuredContent: { encryptedMessage: string}}

    return result
}


async function decryptMessage(client: Client, encryptedMessage: string, encryptionKey: string) {
    const result = await client.callTool({
        name: 'decryptMessage',
        arguments: {
            encryptedMessage,
            encryptionKey
        }
    }) as unknown as { structuredContent: { decryptedMessage: string}}

    return result
}

describe('MCP Tool Test', () => {
    let client: Client
    let encryptionKey = 'my-super-passphrase'

    before(async () => {
        client = await createTestClient()
    })


    after(async () => {
        await client.close()
    })
    it('should encrypt a message', async () => {
        const message = 'Hello World'
        const result = await encryptMessage(
            client,
            message,
            encryptionKey
        )

        assert.ok(
            result.structuredContent?.encryptedMessage.length >= 60,
            'Encrypted message should not be empty'
        )


    })
    it('should dencrypt a message', async () => {
        const message = 'Heyyyy'
        const key = 'my-super-key'
        const { structuredContent: { encryptedMessage }} = await encryptMessage(
            client,
            message,
            key
        )

        const result = await decryptMessage(client, encryptedMessage, key)
        assert.deepStrictEqual(
            result.structuredContent.decryptedMessage,
            message,
            "Decrypted message should match original"
        )
    })

    it('should list the encryption://info resource', async () => {
        const { resources } = await client.listResources()
        const info = resources.find(item => item.uri === "encryption://info")

        assert.ok(info, 'encryption://info resource should be listed')
    })

    it('should return the encrype_message_prompt', async () => {
        const result = await client.getPrompt({
            name: 'encrypt_message_prompt', 
            arguments: {
                message: 'Secret text', 
                encryptionKey,
            }
        })
        const item = result.messages[0].content as unknown as { text: string }
        assert.ok(
            item.text.includes('encrypt_message'), 
            'Prompt should reference the encrypt_message_prompt tool'
        )
    })
})