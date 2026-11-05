import { ToolCall, SecurityPolicy, PolicyViolation } from './types';

// Define your security policies here
export const policies: SecurityPolicy[] = [
  {
    id: 'P001',
    type: 'blacklist_tool',
    description: 'Prevent calls to dangerous system tools.',
    config: {
      blacklistedTools: ['system_exec', 'delete_all_data', 'transfer_funds_unrestricted'],
    },
  },
  {
    id: 'P002',
    type: 'sensitive_arg_regex',
    description: 'Flag tool calls with arguments matching sensitive patterns (e.g., credit card numbers).',
    config: {
      argName: 'account_number',
      regex: '^\\d{13,16}$', // Example: 13-16 digit number
      message: 'Potential credit card or sensitive account number in argument.',
    },
  },
  {
    id: 'P003',
    type: 'max_transaction_amount',
    description: 'Limit the maximum amount for financial transactions.',
    config: {
      toolName: 'transfer_funds',
      amountArg: 'amount',
      maxAmount: 1000, // Max $1000 per transaction
    },
  },
  {
    id: 'P004',
    type: 'blacklist_tool',
    description: 'Prevent calls to experimental_feature.',
    config: {
      blacklistedTools: ['experimental_feature'],
    },
  },
];

export function evaluateToolCalls(toolCalls: ToolCall[]): PolicyViolation[] {
  const violations: PolicyViolation[] = [];

  for (const call of toolCalls) {
    for (const policy of policies) {
      let violation: PolicyViolation | null = null;

      switch (policy.type) {
        case 'blacklist_tool':
          if (policy.config.blacklistedTools.includes(call.tool_name)) {
            violation = {
              policy_id: policy.id,
              description: policy.description,
              tool_call: call,
              reason: `Tool '${call.tool_name}' is blacklisted.`,
            };
          }
          break;

        case 'sensitive_arg_regex':
          if (call.args[policy.config.argName] && String(call.args[policy.config.argName]).match(new RegExp(policy.config.regex))) {
            violation = {
              policy_id: policy.id,
              description: policy.description,
              tool_call: call,
              reason: policy.config.message,
            };
          }
          break;

        case 'max_transaction_amount':
          if (call.tool_name === policy.config.toolName) {
            const amount = parseFloat(call.args[policy.config.amountArg]);
            if (!isNaN(amount) && amount > policy.config.maxAmount) {
              violation = {
                policy_id: policy.id,
                description: policy.description,
                tool_call: call,
                reason: `Transaction amount (${amount}) exceeds maximum allowed (${policy.config.maxAmount}).`,
              };
            }
          }
          break;

        default:
          console.warn(`Unknown policy type: ${policy.type}`);
      }

      if (violation) {
        violations.push(violation);
      }
    }
  }

  return violations;
}
