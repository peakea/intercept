/**
 * Fun tool for sharing information over the network
 * 
 * @autor Ashley Peake
 */
export class Intercept {
    constructor() {
    }

    /**
     * Split the coded words into multiple arrays
     * 
     * @param patterns - the list of patterns to split
     */
    splitPatterns(patterns: string[], splitLength: number): string[][] {
        const result: string[][] = [];
        for (let i = 0; i < patterns.length; i += splitLength) {
            result.push(patterns.slice(i, i + splitLength));
        }
        return result;
    }
    
    /**
     * Escape a string for use in a regular expression
     */
    escapeRegExp(string: string): string {
        return string.replace(/([^\w\s])/g, '\\$&');
    }

    /**
     * Find patterns in a message used to encode and decode messages
     * 
     * @param message - the message to search
     * @param patterns - the patterns to search for
     */
    findPatterns(message: string, patterns: string[]): PatternSearchResult[] {
        const foundPatterns: PatternSearchResult[] = [];
        // search through the message for all of the patterns
        patterns.forEach((pattern, i) => {
            pattern = this.escapeRegExp(pattern);
            const regex = new RegExp(pattern, 'g');
            let match;
            while ((match = regex.exec(message)) !== null) {
                const found: PatternSearchResult = {
                    pos: match.index,
                    codeIndex: i,
                    pattern: pattern,
                };
                foundPatterns.push(found);
            }
        });

        // Remove cross-over patterns
        foundPatterns.sort((a, b) => a.pos - b.pos);
        // Iterate through the foundPatterns array, stopping at the second-to-last element
        for (let i = 0; i < foundPatterns.length - 1; i++) {
            const current = foundPatterns[i]; // Get the current pattern
            const next = foundPatterns[i + 1]; // Get the next pattern
            // Check if the current pattern overlaps with the next pattern
            if (current.pos + current.pattern.length > next.pos) {
                // If the current pattern is longer than the next pattern, remove the next pattern
                if (current.pattern.length >= next.pattern.length) {
                    foundPatterns.splice(i + 1, 1);
                } else {
                    // If the next pattern is longer, remove the current pattern
                    foundPatterns.splice(i, 1);
                }
                i--; // Decrement the index to re-evaluate the new current pattern
            }
        }

        return foundPatterns;
    }

    /**
     * Decode a message using the coded words
     * 
     * @param message - the message to decode
     * @param codeList - the list of codes to use
     * @param wordList - the list of words to search for
     * @param permutation - the permutation of the codes to use
     */
    decode(message: string, codeList: string[], wordList: string[], permutation: bigint = 0n): PatternSearchResult[] {
        // If a permutation is provided, get the nth permutation of the codes
        let permutedCodeList = codeList;
        if (permutation !== 0n) {
            permutedCodeList = this.getNthPermutation(codeList, permutation);
        }

        // Find the codes in the message
        let result: PatternSearchResult[] = this.findPatterns(message, permutedCodeList);

        // Add the decoded words to the result
        for (const code of result) {
            code.code = wordList[code.codeIndex];
        }

        if (wordList.length >= permutedCodeList.length) {
            // Single mode
        } else {
            // Multi mode
            // if codeIndex is greater than the length of the word list reduce it by the length of the word list until it fits within the word list length
            for (const code of result) {
                code.codeIndex = code.codeIndex % wordList.length;
                // Fix the undefined code
                if (code.code === undefined) {
                    code.code = wordList[code.codeIndex];
                }
            }
        }

        return result;
    }

    /**
     * Encode a message using the coded words array
     * 
     * @param message - the message to encode
     * @param wordList - the list of words to search for
     * @param codeList - the list of codes to use
     * @param permutation - the permutation of the codes to use
     */
    encode(message: string, wordList: string[], codeList: string[], permutation: bigint = 0n): PatternSearchResult[] {
        // If a permutation is provided, get the nth permutation of the codes
        let permutedCodeList = codeList;
        if (permutation !== 0n) {
            permutedCodeList = this.getNthPermutation(codeList, permutation);
        }

        // Find the codes in the message
        let result: PatternSearchResult[] = [];

        if (wordList.length >= permutedCodeList.length) {
            // Single mode
            result = this.findPatterns(message, wordList);

            // Add the encoded words to the result
            for (const code of result) {
                code.code = permutedCodeList[code.codeIndex];
            }
        } else {
            // Multi mode
            // Split the code list into arrays of the same length as the word list
            const codeLists: string[][] = this.splitPatterns(permutedCodeList, wordList.length);
            // Encode the message using each set of codes
            for (const codeList of codeLists) {
                const subResult = this.encode(message, wordList, codeList);
                result.push(...subResult);
            }
            // sort the results by position
            result.sort((a, b) => a.pos - b.pos);
        }

        return result;
    }

    /**
     * Create message from the code search results
     */
    createMessage(message: string, results: PatternSearchResult[], codeList: string[]): string {
        let result = message;
        for (let i = results.length - 1; i >= 0; i--) {
            const code = results[i];
            result = result.slice(0, code.pos) + codeList[code.codeIndex] + result.slice(code.pos + code.pattern.length);
        }
        return result;
    }

    /**
     * Get the nth permutation of an array
     *
     * @param elements - the elements to permute
     * @param n - the permutation to get
     */
    getNthPermutation(elements: any[], n: bigint): any[] {
        const result = [];
        const factorials = [1n];
        const len = elements.length;

        // Calculate factorials
        for (let i = 1; i <= len; i++) {
            factorials[i] = factorials[i - 1] * BigInt(i);
        }

        // Adjust n to be within the range of permutations
        n = n % factorials[len];

        // Generate the nth permutation
        for (let i = len; i > 0; i--) {
            const factorial = factorials[i - 1];
            const index = n / factorial;
            result.push(elements[Number(index)]);
            elements.splice(Number(index), 1);
            n = n % factorial;
        }

        return result;
    }
}

/**
 * Pattern search results
 */
export interface PatternSearchResult {
    /**
     * Position of the pattern in the message
     */
    pos: number;

    /**
     * Index of the pattern in the code list
     */
    codeIndex: number;

    /**
     * The pattern that was found
     */
    pattern: string;

    /**
     * The encoded word that was found
     */
    code?: string;
}
