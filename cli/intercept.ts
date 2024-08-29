import { program } from 'commander';
import { Intercept } from '../lib/intercept';
import fs from 'fs';
import readline from 'readline';
import crypto from 'crypto';

/**
 * Command line interface for Intercept
 * 
 * @author Ashley Peake
 */
export class Cli {
    constructor() { }

    /**
     * Open a file stream and read the contents into an array of words
     */
    async getPatternsFromFile(filename: string, options?: { lowercase?: boolean, minPatternLength?: number }) {
        const patternList: string[] = [];
        const minPatternLength = options?.minPatternLength || 0;

        const readLineInterface = readline.createInterface({
            input: fs.createReadStream(filename),
            terminal: false
        });

        for await (const line of readLineInterface) {
            if (line.length === 0) {
                continue;
            }
            for (let pattern of this.splitPatterns(line)) {
                if (options?.lowercase) {
                    pattern = pattern.toLowerCase();
                }
                // only add words that are unique and meet the minimum length requirement
                if (patternList.indexOf(pattern) === -1 && pattern.length >= (minPatternLength || 0)) {
                    patternList.push(pattern);
                }
            }
        }

        return patternList;
    }

    /**
     * Get patterns from a string
     */
    getPatternsFromString(str: string, options?: { lowercase?: boolean, minPatternLength?: number }) {
        const patternList: string[] = [];
        for (let pattern of this.splitPatterns(str)) {
            if (options?.lowercase) {
                pattern = pattern.toLowerCase();
            }
            // only add words that are unique and meet the minimum length requirement
            if (patternList.indexOf(pattern) === -1 && pattern.length >= (options?.minPatternLength || 0)) {
                patternList.push(pattern);
            }
        }
        return patternList;
    }

    /**
     * Split a string into an array of words
     * 
     * split by all special characters and spaces
     */
    *splitPatterns(str: string): Iterable<string> {
        const patterns = str.split(/[^a-zA-Z0-9]/);
        for (const pattern of patterns) {
            if (pattern.length > 0) {
                yield pattern;
            }
        }
    }

    /**
     * Turn input into a bigint representing a hash of the input
     */
    hashAsBigInt(input: string, hashAlgorithm: string): bigint {
        // Create a hash of the permutation using the specified algorithm
        const hash = crypto.createHash(hashAlgorithm);
        hash.update(input);
        const hashBuffer = hash.digest();

        // Convert the hash buffer to a bigint
        const hashHex = hashBuffer.toString('hex');
        const b = BigInt(`0x${hashHex}`);
        return b;
    }

    /**
     * Run the command line interface
     */
    run(): void {
        program
            .version('0.0.1')
            .description('Encode and decode messages using a coded word list');
        program.command('encode')
            .description('Encode a message using the coded words array')
            .option('-c, --codes <codes>', 'The code words to use')
            .option('-cf, --code-file <codeFile>', 'The file containing the coded words to use')
            .option('-ic, --ignore-common', 'Ignore common words')
            .option('-w, --words <words>', 'The plain text words to use')
            .option('-wf, --word-file <wordFile>', 'The file containing the plain text words to use')
            .option('-m, --message <message>', 'The message to encode or decode')
            .option('-mf, --message-file <messageFile>', 'The file containing the message to encode or decode')
            .option('-pe, --permutation <permutation>', 'The direct permutation of the codes to use (will override password option)')
            .option('-p, --password <password>', 'The password to produce permutation of the codes to use (will be hashed)')
            .option('-h, --password-hash <passwordHash>', 'The hash algorithm to use to modify the permutation')
            .option('-l, --lowercase', 'All codes are treated as lowercase preventing e.g. "Sail" and "sail" from used as different codes')
            .option('-lm, --limit <limit>', 'The maximum multiple of codes to use', '3')
            .option('-mc, --min-code-length <minCodeLength>', 'The minimum length of a code', '3')
            .action(async (options) => {
                const intercept = new Intercept();

                const message = options.message;
                let codes: string[] = [];
                let words: string[] = [];
                let limit = parseInt(options.limit);
                let permutation = 0n;
                if (options.permutation) {
                    permutation = BigInt(options.permutation);
                } else if (options.password) {
                    permutation = this.hashAsBigInt(options.password, options.passwordHash || 'sha512');
                }
                let minCodeLength = parseInt(options.minCodeLength);

                if (options.codes) {
                    codes = this.getPatternsFromString(options.codes, { lowercase: options.lowercase, minPatternLength: minCodeLength });
                } else if (options.codeFile) {
                    codes = await this.getPatternsFromFile(options.codeFile, { lowercase: options.lowercase, minPatternLength: minCodeLength });
                } else {
                    throw new Error('No codes provided');
                }
                if (options.words) {
                    words = this.getPatternsFromString(options.words, { lowercase: options.lowercase });
                } else if (options.wordFile) {
                    words = await this.getPatternsFromFile(options.wordFile, { lowercase: options.lowercase });
                } else {
                    throw new Error('No words provided');
                }

                if (options.ignoreCommon) {
                    // remove common words from the code list to make creating messages easier
                    const commonWords = await this.getPatternsFromFile('./common-words.txt');
                    codes = codes.filter(code => commonWords.indexOf(code) === -1);
                }

                if (limit) {
                    // limit the number of codes to use as a multiple of the number of words
                    const codeCount = words.length * limit;
                    codes = codes.slice(0, codeCount);
                }

                // show the codes and words
                console.log('Codes', codes);
                console.log('Words', words);

                const result = intercept.encode(message, words, codes, permutation);
                console.log('Code pallet');
                for (const code of result) {
                    console.log(code);
                }
            });
        program.command('decode').description('Decode a message using the coded words array')
            .description('Encode a message using the coded words array')
            .option('-c, --codes <codes>', 'The code words to use')
            .option('-cf, --code-file <codeFile>', 'The file containing the coded words to use')
            .option('-ic, --ignore-common', 'Ignore common words')
            .option('-w, --words <words>', 'The plain text words to use')
            .option('-wf, --word-file <wordFile>', 'The file containing the plain text words to use')
            .option('-m, --message <message>', 'The message to encode or decode')
            .option('-mf, --message-file <messageFile>', 'The file containing the message to encode or decode')
            .option('-pe, --permutation <permutation>', 'The direct permutation of the codes to use (will override password option)')
            .option('-p, --password <password>', 'The password to produce permutation of the codes to use (will be hashed)')
            .option('-h, --password-hash <passwordHash>', 'The hash algorithm to use to modify the permutation')
            .option('-l, --lowercase', 'All codes are treated as lowercase preventing e.g. "Sail" and "sail" from used as different codes')
            .option('-lm, --limit <limit>', 'The maximum multiple of codes to use', '3')
            .option('-mc, --min-code-length <minCodeLength>', 'The minimum length of a code', '3')
            .action(async (options) => {
                const intercept = new Intercept();

                const message = options.message;
                let codes: string[] = [];
                let words: string[] = [];
                let limit = parseInt(options.limit);
                let permutation = 0n;
                if (options.permutation) {
                    permutation = BigInt(options.permutation);
                } else if (options.password) {
                    permutation = this.hashAsBigInt(options.password, options.passwordHash || 'sha512');
                }
                let minCodeLength = parseInt(options.minCodeLength);

                if (options.codes) {
                    codes = this.getPatternsFromString(options.codes, { lowercase: options.lowercase, minPatternLength: minCodeLength });
                } else if (options.codeFile) {
                    codes = await this.getPatternsFromFile(options.codeFile, { lowercase: options.lowercase, minPatternLength: minCodeLength });
                } else {
                    throw new Error('No codes provided');
                }
                if (options.words) {
                    words = this.getPatternsFromString(options.words, { lowercase: options.lowercase });
                } else if (options.wordFile) {
                    words = await this.getPatternsFromFile(options.wordFile, { lowercase: options.lowercase });
                } else {
                    throw new Error('No words provided');
                }

                if (options.ignoreCommon) {
                    // remove common words from the code list to make creating messages easier
                    const commonWords = await this.getPatternsFromFile('./common-words.txt');
                    codes = codes.filter(code => commonWords.indexOf(code) === -1);
                }

                if (limit) {
                    // limit the number of codes to use as a multiple of the number of words
                    const codeCount = words.length * limit;
                    codes = codes.slice(0, codeCount);
                }

                // show the codes and words
                console.log('Codes', codes);
                console.log('Words', words);

                const result = intercept.decode(message, codes, words, permutation);
                console.log('Decoded message');
                for (const code of result) {
                    console.log(code);
                }
            });
        program.parse(process.argv);
    }
}

const cli = new Cli();
cli.run();