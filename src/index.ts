import { readFileSync } from 'fs';
import { evaluateToolCalls } from './policies';
import { ToolCall, PolicyViolation } from './types';

function main() {
  let inputData = '';

  // Read input from stdin
  process.stdin.on('data', (chunk) => {
    inputData += chunk.toString();
  });

  process.stdin.on('end', () => {
    try {
      const toolCalls: ToolCall[] = JSON.parse(inputData);
      const violations: PolicyViolation[] = evaluateToolCalls(toolCalls);

      if (violations.length > 0) {
        console.error('Agent tool call security violations detected!');
        violations.forEach((v) => {
          console.error(`- Policy ID: ${v.policy_id}`);
          console.error(`  Description: ${v.description}`);
          console.error(`  Reason: ${v.reason}`);
          console.error(`  Tool Call: ${JSON.stringify(v.tool_call, null, 2)}\n`);
        });
        process.exit(1); // Indicate failure
      } else {
        console.log('No security violations detected for proposed agent tool calls.');
        process.exit(0); // Indicate success
      }
    } catch (error) {
      console.error('Error processing input:', error);
      process.exit(1);
    }
  });

  process.stdin.on('error', (err) => {
    console.error('Error reading from stdin:', err);
    process.exit(1);
  });
}

main();
