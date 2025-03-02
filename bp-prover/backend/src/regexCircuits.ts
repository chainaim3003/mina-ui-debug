import { Bool, Field, UInt8 } from 'o1js';


// Command used: '(a|b)c' '--functionName' 'myRegexFunction' '--filePath' './src/regexCircuits.ts'
export function myRegexFunction(input: UInt8[]) {
	const num_bytes = input.length;
	let states: Bool[][] = Array.from({ length: num_bytes + 1 }, () => []);
	let state_changed: Bool[] = Array.from({ length: num_bytes }, () => Bool(false));
	
	states[0][0] = Bool(true);
	for (let i = 1; i < 3; i++) {
		states[0][i] = Bool(false);
	}
	
	for (let i = 0; i < num_bytes; i++) {
		const eq0 = input[i].value.equals(97);
		const eq1 = input[i].value.equals(98);
		let multi_or0 = Bool(false);
		multi_or0 = multi_or0.or(eq0);
		multi_or0 = multi_or0.or(eq1);
		const and0 = states[i][0].and(multi_or0);
		states[i+1][1] = and0;
		state_changed[i] = state_changed[i].or(states[i+1][1]);
		const eq2 = input[i].value.equals(99);
		const and1 = states[i][1].and(eq2);
		states[i+1][2] = and1;
		state_changed[i] = state_changed[i].or(states[i+1][2]);
		states[i+1][0] = state_changed[i].not();
	}
	
	let final_state_result = Bool(false);
	for (let i = 0; i <= num_bytes; i++) {
		final_state_result = final_state_result.or(states[i][2]);
	}
	const out = final_state_result;

	return out;
}
