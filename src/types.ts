export interface ToolCall {
  tool_name: string;
  args: Record<string, any>;
}

export type PolicyType = 'blacklist_tool' | 'sensitive_arg_regex' | 'max_transaction_amount';

export interface SecurityPolicy {
  id: string;
  type: PolicyType;
  description: string;
  config: any; // Configuration specific to the policy type
}

export interface PolicyViolation {
  policy_id: string;
  description: string;
  tool_call: ToolCall;
  reason: string;
}
