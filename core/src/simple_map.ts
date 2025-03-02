import { Field, Poseidon } from 'o1js';

function areStringsEqual(str1: string, str2: string) {
    // Convert strings to Fields using Poseidon hash
    const hash1 = Poseidon.hash(str1.split("").map(c => Field(c.charCodeAt(0))));//print c.charcodeAt(0)//print c//
    console.log(hash1);
    const hash2 = Poseidon.hash(str2.split("").map(c => Field(c.charCodeAt(0))));
    console.log(hash2);
    // Compare hashes
    return hash1.equals(hash2).toBoolean();
}

// Example usage
console.log(areStringsEqual("ACTIVE COMPLIANT", "ACTIVE COMPLIANT")); // true
console.log(areStringsEqual("ACTIVE COMPLIANT", "DISSOLVED")); // false
