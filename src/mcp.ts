import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod/v3";
import { decrypt, encrypt } from "./service.ts";


export const server = new McpServer({
    name: '@lucasharca/ciphersuite-mcp',
    version: '0.0.1'
})

server.registerTool(
    'encryptMessage',
    {
        description: 'Encrypt a message', 
        inputSchema: {
            message: z.string().describe("Message to encrypt"),
            encryptionKey: z.string().describe("Any passphrase to use for encryption - the server derives a strong key from it")
        },
        outputSchema: {
            encryptedMessage:  z.string().describe(
                "The encrypted message (format: iv: ciphertext)"
            )
        }
    },
    async ({message, encryptionKey}) => {
        try {
            const encryptedMessage = encrypt(message, encryptionKey)
            return {
                content: [{ type: 'text', text: encryptedMessage}],
                structuredContent: { encryptedMessage }
            }
        } catch (error) {
            return {
                isError: true,
                content: [{
                    type: 'text',
                    text: 'Failed to encrypt message. Check encryption key'
                }]
            }
        }
    }
)

server.registerTool(
    'decryptMessage', 
    {
        description: 'Decrypt a message that was encrypted with encryptMessage tool',
        inputSchema: {
            encryptedMessage: z.string().describe("Message to decrypt"),
            encryptionKey:  z.string().describe("Any passphrase to use for encryption - the server derives a strong key from it")
        },
        outputSchema: {
            decryptedMessage: z.string().describe(
                "The decrypted message (format: iv: ciphertext)"
            )
        }
    },
    async({encryptedMessage, encryptionKey}) => {
        try {
            const decryptedMessage = decrypt(encryptedMessage, encryptionKey)
            return {
                content: [{ type: 'text', text: decryptedMessage}],
                structuredContent: { decryptedMessage }
            }
        } catch (error) {
            return {
                isError: true,
                content: [{
                    type: 'text', 
                    text: 'Failed to decrypt message, check the values'
                }]
            }
        }
    }
)

server.registerResource(
    'encryption://info',
    'encryption://info',
    {
        description: 'Describe the encryption algorithm, key requirements, and output format'
    },
    () => ({
        contents: [
            {
                uri: 'encryption://info',
                mimeType: 'text/plain',
                text: `
                    Algorithm : AES-256-CBC
                    Key derivation: scrypt (passphrase + fixed server salt → 32-byte key)
                    Output format: <16-byte IV in hex>:<ciphertext in hex>  (separated by ":")
                    Notes:
                    - Users pass any passphrase — the server derives a strong 32-byte key automatically using scrypt.
                    - A random IV is generated for every encryption — the same message encrypted twice will produce different output.
                    - Use the exact same passphrase to decrypt.
                    - Keep the full "iv:ciphertext" string to decrypt later.
                `.trim(),
            }
        ]
    })
)

server.registerPrompt(
    "encrypt_message_prompt",
    {
        description: 'Prompt to encrypt a plain-text message using the encrypt_message tool',
        argsSchema: {
            message: z.string().describe("Message to encrypt"),
            encryptionKey: z.string().describe("Any passphrase to use for encryption - the server derives a strong key from it")
        }
    },
    ({ message, encryptionKey}) => ({
        messages: [
            {
                role: 'user',
                content: {
                    type: 'text',
                    text: `Please encrypt the following message using the encrypt_message tool.\nMessage: ${message}\nEncryption key: ${encryptionKey}`,
                }
            }
        ]
    })
)
