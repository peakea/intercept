import { program } from 'commander';
import { Intercept, PatternSearchResult } from '../lib/intercept';
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
     * Write the formatted output to a file
     */
    async writeFormattedOutput(filename: string, result: PatternSearchResult[]) {
        const extension = filename.split('.').pop();
        switch (extension) {
            case 'json': {
                const json = JSON.stringify(result, null, 2);
                fs.writeFileSync(filename, json);
                break;
            }
            case 'csv': {
                let csv = ['Code,Code Index,Pattern,Position'];
                for (const code of result) {
                    csv.push(`${code.code},${code.codeIndex},${code.pattern},${code.pos}`);
                }
                fs.writeFileSync(filename, csv.join('\n'));
                break;
            }
            case 'txt': {
                let txt = result.map(code => code.code).join(' ');
                fs.writeFileSync(filename, txt);
                break;
            }
            default: {
                throw new Error('Invalid output file format valid formats are json, csv, txt');
            }
        }
    }

    /**
     * Get the codes to use
     */
    async getCodes(options: any) {
        // get the minimum code length
        let minPatternLength = parseInt(options.minCodeLength);
        
        // Get the codes to use
        let codes: string[] = [];
        if (options.codes) {
            codes = this.getPatternsFromString(options.codes, { lowercase: options.lowercase, minPatternLength });
        } else if (options.codeFile) {
            codes = await this.getPatternsFromFile(options.codeFile, { lowercase: options.lowercase, minPatternLength });
        } else {
            throw new Error('No codes provided');
        }

        // ignore common words in code list
        if (options.ignoreCommon) {
            const commonWords = await this.getPatternsFromFile('./common-words.txt');
            console.log('Ignoring common words', commonWords);
            if (options.lowercase) {
                commonWords.map(word => word.toLowerCase());
            }
            codes = codes.filter(code => commonWords.indexOf(code) === -1);
        }

        // Limit the number of codes to use as a multiple of the number of words
        let limit = parseInt(options.limit);
        if (limit) {
            const codeCount = options.wordLength * limit;
            codes = codes.slice(0, codeCount);
        }

        return codes;
    }
    
    /**
     * Get the permutation to use
     */
    getPermutation(options: any) {
        // get the permutation to use
        let permutation = BigInt(options.permutation);
        if (options.password) {
            permutation = this.hashAsBigInt(options.password, options.passwordHash);
        }
        return permutation;
    }

    /**
     * Get thee words to use
     */
    async getWords(options: any) {
        // Get the words to use
        let words: string[] = [];
        if (options.words) {
            words = this.getPatternsFromString(options.words, { lowercase: options.lowercase });
        } else if (options.wordFile) {
            words = await this.getPatternsFromFile(options.wordFile, { lowercase: options.lowercase });
        } else {
            throw new Error('No words provided');
        }
        return words;
    }
    
    /**
     * Get the message to encode or decode
     */
    getMessage(options: any) {
        // get the message to encode
        let message = options.message;
        if (options.messageFile) {
            message = fs.readFileSync(options.messageFile, 'utf8');
        } else if (!message) {
            throw new Error('No message provided');
        }
        return message;
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
            .option('-pe, --permutation <permutation>', 'The direct permutation of the codes to use (will override password option)', '0')
            .option('-p, --password <password>', 'The password to produce permutation of the codes to use (will be hashed)')
            .option('-ha, --password-hash <passwordHash>', 'The hash algorithm to use to modify the permutation', 'sha512')
            .option('-l, --lowercase', 'All codes are treated as lowercase preventing e.g. "Sail" and "sail" from used as different codes', false)
            .option('-lm, --limit <limit>', 'The maximum multiple of codes to use', '4')
            .option('-mc, --min-code-length <minPatternLength>', 'The minimum length of a code', '3')
            .option('-o, --output <output>', 'The file to output the encoded message to')
            .action(async (options) => {
                const intercept = new Intercept();

                // get the message to decode
                let message = this.getMessage(options);
                
                // get the minimum code length
                let minPatternLength = parseInt(options.minCodeLength);

                // get the words to use
                let words: string[] = await this.getWords(options);

                // get the codes to use
                options.wordLength = words.length;
                let codes: string[] = await this.getCodes(options);
                
                // get the permutation to use
                let permutation = this.getPermutation(options);

                // show the codes and words
                console.log('Codes', codes);
                console.log('Words', words);

                const result = intercept.encode(message, words, codes, permutation);
                console.log('Code pallet');
                for (const code of result) {
                    console.log(code);
                }

                // output the message
                if (options.output) {
                    await this.writeFormattedOutput(options.output, result);
                }
            });
        program.command('decode').description('Decode a message using the coded words array')
            .description('Decode a message using the coded words array')
            .option('-c, --codes <codes>', 'The code words to use')
            .option('-cf, --code-file <codeFile>', 'The file containing the coded words to use')
            .option('-ic, --ignore-common', 'Ignore common words')
            .option('-w, --words <words>', 'The plain text words to use')
            .option('-wf, --word-file <wordFile>', 'The file containing the plain text words to use')
            .option('-m, --message <message>', 'The message to encode or decode')
            .option('-mf, --message-file <messageFile>', 'The file containing the message to encode or decode')
            .option('-pe, --permutation <permutation>', 'The direct permutation of the codes to use (will override password option)', '0')
            .option('-p, --password <password>', 'The password to produce permutation of the codes to use (will be hashed)')
            .option('-ha, --password-hash <passwordHash>', 'The hash algorithm to use to modify the permutation', 'sha512')
            .option('-l, --lowercase', 'All codes are treated as lowercase preventing e.g. "Sail" and "sail" from used as different codes')
            .option('-lm, --limit <limit>', 'The maximum multiple of codes to use', '4')
            .option('-mc, --min-code-length <minCodeLength>', 'The minimum length of a code', '3')
            .option('-o, --output <output>', 'The file to output the decoded message to')
            .action(async (options) => {
                const intercept = new Intercept();

                // get the message to decode
                let message = this.getMessage(options);

                // get the words to use
                const words: string[] = await this.getWords(options);

                // get the codes to use
                options.wordLength = words.length;
                const codes: string[] = await this.getCodes(options);
                
                // get the permutation to use
                const permutation = this.getPermutation(options);

                // show the codes and words
                console.log('Codes', codes);
                console.log('Words', words);

                const result = intercept.decode(message, codes, words, permutation);
                console.log('Decoded message');
                for (const code of result) {
                    console.log(code);
                }

                // output the decoded message
                if (options.output) {
                    await this.writeFormattedOutput(options.output, result);
                }
            });
        program.parse(process.argv);
    }
}

const cli = new Cli();
cli.run();