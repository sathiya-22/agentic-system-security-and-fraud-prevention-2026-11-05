The real problem and who it affects:
Developers building agentic systems face significant challenges in implementing robust security measures and fraud detection. This is particularly critical for platforms handling sensitive data or financial transactions. Agents, by their nature, can be vulnerable to breaches or misuse due to their ability to execute actions and interact with external systems. This impacts user trust and system integrity, potentially leading to financial losses or data exposure.

This prototype addresses the need for a mechanism to detect suspicious patterns in agent actions, specifically focusing on tool calls. It provides a framework for defining and evaluating security policies against an agent's intended actions (tool calls) *before* they are executed. This helps prevent malicious or erroneous actions from ever reaching external systems.

Why this project shape/stack was chosen for it:
A Node.js/TypeScript CLI was chosen because:
1.  **Policy Definition:** TypeScript's strong typing helps define clear and structured security policies.
2.  **JSON-centric:** Agent tool calls are often represented in JSON, which Node.js/TypeScript handles natively and efficiently.
3.  **Extensibility:** The module-based structure allows for easy addition of new policy types or integration with external systems (e.g., SIEMs, fraud detection APIs).
4.  **CLI for Integration:** A CLI makes it easy to integrate into existing agent orchestration workflows, allowing developers to pipe agent tool call proposals directly into the security checker. It can be run as a pre-execution hook.

Setup and usage instructions that work with zero API keys:
This project uses fixture data for demonstration and does not require any API keys.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the security checker with fixture data:**
    The `test-tool-calls.json` file contains example agent tool call proposals.
    ```bash
    npm start -- < test-tool-calls.json
    ```
    This command pipes the fixture data into the `src/index.ts` script, which then evaluates it against the defined security policies. The output will indicate which tool calls were flagged and why.

Whether an optional real-LLM adapter exists and how to enable it, if so:
This prototype does not involve direct LLM interaction. Its purpose is to validate the *output* of an LLM-powered agent (specifically, its proposed tool calls) *before* execution. Therefore, no LLM adapter is required or provided. The focus is on the security layer *around* the agent's actions.
