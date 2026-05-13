# Creating MCP Server POC

This is a Proof of Concept (POC) project for studying and implementing Model Context Protocol (MCP) servers. It demonstrates how to build an MCP server that provides AES-256-CBC encryption and decryption tools, a resource describing the algorithm, and ready-to-use prompts — all runnable directly inside VS Code Copilot Chat.

The goal of this project is to serve as a learning resource for understanding MCP server development, including tool registration, resource handling, and prompt creation.

---

## What it does

| Capability | Name | Description |
|---|---|---|
| 🔧 Tool | `encryptMessage` | Encrypts any plain-text message with a passphrase |
| 🔧 Tool | `decryptMessage` | Decrypts a previously encrypted message with the same passphrase |
| 📄 Resource | `encryption://info` | Returns details about the algorithm, key derivation, and output format |
| 💬 Prompt | `encrypt_message_prompt` | Pre-built prompt that asks the agent to encrypt a message |

### How encryption works

- **Algorithm**: AES-256-CBC
- **Key derivation**: `scrypt(passphrase, fixedSalt, 32)` — you pass any passphrase string; the server derives a strong 32-byte key automatically
- **Output format**: `<IV in hex>:<ciphertext in hex>` — keep the full string to decrypt later
- **IV**: a fresh random 16-byte IV is generated on every encryption call, so the same message encrypted twice produces different output

---

## Prerequisites

- **Node.js v24+** (see `engines` in `package.json`)

---

## Installation

```bash
npm install
```

No build step is needed — the server runs TypeScript directly via Node.js native TypeScript support.

---

## Usage

### Running the Server

To start the MCP server:

```bash
npm run dev
```

This will run the server in watch mode with debugging enabled.

### Testing

Run the tests to verify the functionality:

```bash
npm test
```

Or run tests in watch mode:

```bash
npm run test:dev
```

### Inspecting with MCP Inspector

To inspect the server using the MCP Inspector:

```bash
npm run mcp:inspect
```

This opens a web interface to interact with the MCP server.

---

## Project Structure

- `src/index.ts`: Entry point that sets up the MCP server with stdio transport.
- `src/mcp.ts`: Defines the MCP server, registers tools, resources, and prompts.
- `src/service.ts`: Implements the encryption and decryption logic using Node.js crypto module.
- `tests/`: Contains test files to verify the MCP server functionality.
- `package.json`: Project configuration and scripts.
- `tsconfig.json`: TypeScript configuration.

---

## Learning Objectives

This POC covers:

- Setting up an MCP server using the `@modelcontextprotocol/sdk`.
- Registering tools with input/output schemas using Zod.
- Implementing resources for static information.
- Creating prompts for pre-defined interactions.
- Handling errors in tool executions.
- Writing tests for MCP server functionality.
- Using stdio transport for communication.

---

## Contributing

This is a POC project for educational purposes. Feel free to experiment and modify the code to learn more about MCP servers.

---

## License

ISC
    "ciphersuite-mcp": {
      "command": "node",
      "args": ["--experimental-strip-types", "ABSOLUTE_PATH_TO_PROJECT/src/index.ts"]
    }
  }
}
```

or via npm
```json
{
  "servers": {
    "ciphersuite-mcp": {
      "command": "npx",
      "args": ["-y", "@erickwendel/ciphersuite-mcp"]
    }
  }
}
```

> **Tip:** You can also add this server to your user-level MCP config at `~/.vscode/mcp.json` to make it available in every workspace.

### 2. Reload VS Code

Open the Command Palette (`Cmd+Shift+P`) and run **Developer: Reload Window** (or just restart VS Code).

### 3. Use it in Copilot Chat

Open Copilot Chat (Agent mode) and try:

```
Encrypt the message "Hello, World!" using the passphrase "my-secret-key"
```

```
Decrypt this message: a3f1...:<ciphertext> using the passphrase "my-secret-key"
```

```
Show me the encryption://info resource
```

The agent will automatically call the appropriate tool and return the result.

---

## Running the MCP Inspector

The MCP Inspector lets you explore and test all tools, resources, and prompts interactively in a browser UI:

```bash
npm run mcp:inspect
```

This opens the inspector at `http://localhost:5173` and connects it to the running server.

---

## Running tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (with debugger)
npm run test:dev
```

The test suite covers:

- Encrypting a message
- Decrypting a message with the correct passphrase
- Listing and reading the `encryption://info` resource
- Fetching both prompts
- Error: decrypting with the wrong passphrase
- Error: decrypting a malformed ciphertext

---

## Project structure

```
src/
  index.ts   # Entry point — connects the server to stdio transport
  mcp.ts     # All tools, resources, and prompts are registered here
tests/
  mcp.test.ts
```

---

## Available scripts

| Script | Description |
|---|---|
| `npm start` | Start the server (used by MCP clients) |
| `npm run dev` | Start with file-watch and Node.js inspector |
| `npm test` | Run all tests |
| `npm run test:dev` | Run tests in watch mode |
| `npm run mcp:inspect` | Open the MCP Inspector UI |
