# Intercept Project
## Overview
Intercept is a fun tool designed to encode and decode messages using a coded word list so that they can be hidden inside communications like emails, SMS and tweets. It provides a flexible way to transform messages based on predefined patterns and permutations.

## Features
- Encode messages using a coded word list.
- Decode messages back to their original form.
- Support for custom code and word files you can even use books or other sources as code lists.
- Ability to specify a specific code list permutations or simply use a password and hash algorithm to create one for convenient encoding/decoding.
- Hide codes in a large body of text.
- Select codes from a code pallet so that commonly used letters are obfuscated.

## Installation
To install the Intercept project, clone the repository and install the dependencies then build the library or client with `npm run build`. The client can be ran by launching a terminal at the build folder default `./cli/dist/cli/` and running `node intercept` intercept The common words list must be in the same directory as the CLI to use the feature.

## Usage
The library is provided for use in your applications. The Intercept CLI provides a way to prove the tool and has two main commands: encode and decode.

### Encode
Encode a message using the coded words array.

Options:
  -c, --codes <codes>                     The code words to use
  -cf, --code-file <codeFile>             The file containing the coded words to use
  -ic, --ignore-common                    Ignore common words
  -w, --words <words>                     The plain text words to use
  -wf, --word-file <wordFile>             The file containing the plain text words to use
  -m, --message <message>                 The message to encode or decode
  -mf, --message-file <messageFile>       The file containing the message to encode or decode
  -pe, --permutation <permutation>        The direct permutation of the codes to use (will override password
                                          option)
  -p, --password <password>               The password to produce permutation of the codes to use (will be
                                          hashed)
  -h, --password-hash <passwordHash>      The hash algorithm to use to modify the permutation
  -l, --lowercase                         All codes are treated as lowercase preventing e.g. "Sail" and
                                          "sail" from used as different codes
  -lm, --limit <limit>                    The maximum multiple of codes to use (default: "3")
  -mc, --min-code-length <minCodeLength>  The minimum length of a code (default: "3")
  --help                                  display help for command

### Decode
Decode a message using the coded words array.

Options:
  -c, --codes <codes>                     The code words to use
  -cf, --code-file <codeFile>             The file containing the coded words to use
  -ic, --ignore-common                    Ignore common words
  -w, --words <words>                     The plain text words to use
  -wf, --word-file <wordFile>             The file containing the plain text words to use
  -m, --message <message>                 The message to encode or decode
  -mf, --message-file <messageFile>       The file containing the message to encode or decode
  -pe, --permutation <permutation>        The direct permutation of the codes to use (will override password option)
  -p, --password <password>               The password to produce permutation of the codes to use (will be hashed)
  -h, --password-hash <passwordHash>      The hash algorithm to use to modify the permutation
  -l, --lowercase                         All codes are treated as lowercase preventing e.g. "Sail" and "sail" from used as
                                          different codes
  -lm, --limit <limit>                    The maximum multiple of codes to use (default: "3")
  -mc, --min-code-length <minCodeLength>  The minimum length of a code (default: "3")
  --help                                  display help for command

## Examples
- Encoding Example
- Decoding Example

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
.
