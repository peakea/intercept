import { Intercept } from "./intercept";

/**
 * Test the Intercept class
 */
describe("Intercept", () => {
    /**
     * 32 animal words to test with
     * 2 to the power of 5 is 32
     */
    const animalWords = [
        "cat", "dog", "fish", "bird", "mouse", "rat", "snake", "lizard", "turtle", "frog", "toad", "newt", "salamander", "iguana", "chameleon", "gecko",
        "ant", "bee", "wasp", "hornet", "butterfly", "moth", "caterpillar", "beetle", "ladybug", "fly", "mosquito", "dragonfly", "cricket", "grasshopper", "firefly", "spider",
    ];

    /**
     * 14 phone number words to test with
     */
    const phoneWords = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "*", "#", " "];

    /**
     * 3 letters to test with
     */
    const letterWords = ["a", "b", "c"];

    /**
     * 3 numbers to test with
     */
    const numberWords = ["1", "2", "3"];

    describe("encode", () => {
        it("should encode '123' to ['a', 'b', 'c'] using numberWords and letterWords", () => {
            const intercept = new Intercept();
            const expected = [
                { pos: 0, codeIndex: 0, pattern: '1', code: 'a' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'b' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'c' }
            ];
            const actual = intercept.encode("123", numberWords.slice(), letterWords.slice());
            expect(actual).toEqual(expected);
        });

        it("should encode '123' to ['b', 'c', 'a'] using numberWords, letterWords, and BigNumber(3)", () => {
            const intercept = new Intercept();
            const expected = [
                { pos: 0, codeIndex: 0, pattern: '1', code: 'b' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'c' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'a' }
            ];
            const actual = intercept.encode("123", numberWords.slice(), letterWords.slice(), 3n);
            expect(actual).toEqual(expected);
        });

        it("should encode a message using all codedWords", () => {
            const intercept = new Intercept();
            const expected = [
                { pos: 0, codeIndex: 0, pattern: '1', code: 'cat' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'bird' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'snake' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'frog' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'salamander' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'gecko' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'wasp' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'moth' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'ladybug' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'dragonfly' },
                { pos: 0, codeIndex: 0, pattern: '1', code: 'firefly' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'dog' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'mouse' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'lizard' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'toad' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'iguana' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'ant' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'hornet' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'caterpillar' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'fly' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'cricket' },
                { pos: 1, codeIndex: 1, pattern: '2', code: 'spider' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'fish' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'rat' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'turtle' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'newt' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'chameleon' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'bee' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'butterfly' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'beetle' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'mosquito' },
                { pos: 2, codeIndex: 2, pattern: '3', code: 'grasshopper' },
                { pos: 2, codeIndex: 2, pattern: '3', code: undefined }
            ];
            const actual = intercept.encode("123", numberWords.slice(), animalWords.slice());
            expect(actual).toEqual(expected);
        });

        it("should encode a message using all codedWords", () => {
            const intercept = new Intercept();

            const expected = [
                { pos: 0, codeIndex: 1, pattern: '2', code: 'dog' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'mouse' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'lizard' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'toad' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'iguana' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'ant' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'moth' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'caterpillar' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'beetle' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'mosquito' },
                { pos: 0, codeIndex: 1, pattern: '2', code: 'ladybug' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'cat' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'bird' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'snake' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'frog' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'salamander' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'gecko' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'wasp' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'grasshopper' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'fly' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'firefly' },
                { pos: 1, codeIndex: 0, pattern: '1', code: 'spider' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'dog' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'mouse' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'lizard' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'toad' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'iguana' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'ant' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'moth' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'caterpillar' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'beetle' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'mosquito' },
                { pos: 2, codeIndex: 1, pattern: '2', code: 'ladybug' }
            ];
            const actual = intercept.encode("212", numberWords.slice(), animalWords.slice(), 987654321n);
            console.log(actual);
            expect(actual).toEqual(expected);
        });
    });

    describe("decode", () => {
        it("should decode a message using codedWords", () => {
            const intercept = new Intercept();
            const expected = [
                { pos: 0, codeIndex: 2, pattern: 'c', code: '3' },
                { pos: 2, codeIndex: 1, pattern: 'b', code: '2' },
                { pos: 4, codeIndex: 0, pattern: 'a', code: '1' }
            ];
            const actual = intercept.decode("c b a", letterWords.slice(), numberWords.slice());
            expect(actual).toEqual(expected);
        });

        it("should decode a message using codedWords", () => {
            const intercept = new Intercept();
            const expected = [
                { pos: 0, codeIndex: 0, pattern: 'b', code: '1' },
                { pos: 2, codeIndex: 1, pattern: 'c', code: '2' },
                { pos: 4, codeIndex: 2, pattern: 'a', code: '3' }
            ];
            const actual = intercept.decode("b c a", letterWords.slice(), numberWords.slice(), 3n);
            expect(actual).toEqual(expected);
        });

        it("should decode a message using all codedWords", () => {
            const intercept = new Intercept();
            const expected: any[] = [
                { pos: 0, codeIndex: 0, pattern: 'cat', code: '1' },
                { pos: 4, codeIndex: 1, pattern: 'dog', code: '2' },
                { pos: 8, codeIndex: 2, pattern: 'fish', code: '3' },
                { pos: 13, codeIndex: 1, pattern: 'caterpillar', code: '2' },
                { pos: 25, codeIndex: 2, pattern: 'beetle', code: '3' },
                { pos: 32, codeIndex: 0, pattern: 'ladybug', code: '1' }
            ];
            const actual = intercept.decode("cat dog fish caterpillar beetle ladybug", animalWords.slice(), numberWords.slice());
            expect(actual).toEqual(expected);
        });

        it("should decode a message using all codedWords", () => {
            const intercept = new Intercept();
            const expected: any[] = [
                { pos: 0, codeIndex: 1, pattern: 'ladybug', code: '2' },
                { pos: 7, codeIndex: 0, pattern: 'cat', code: '1' },
                { pos: 10, codeIndex: 1, pattern: 'caterpillar', code: '2' }
            ];
            const actual = intercept.decode("ladybugcatcaterpillar", animalWords.slice(), numberWords.slice(), 987654321n);
            console.log('actual', actual, 'expected', expected);
            expect(actual).toEqual(expected);
        });
    });

    describe("getNthPermutation", () => {
        it("should get the nth permutation of an array", () => {
            const intercept = new Intercept();
            const expected = ["b", "a", "c"];
            const actual = intercept.getNthPermutation(letterWords.slice(), 2n);
            expect(actual).toEqual(expected);
        });
    });

    describe("findPatterns", () => {
        it("should find the patterns in a message ignoring overlap", () => {
            const intercept = new Intercept();
            const expected = [
                { pos: 0, codeIndex: 0, pattern: 'cat' },
                { pos: 4, codeIndex: 22, pattern: 'caterpillar' },
            ];
            const actual = intercept.findPatterns("cat caterpillar", animalWords.slice());
            expect(actual).toEqual(expected);
        });
        it("should find the patterns in a message ignoring overlap", () => {
            const intercept = new Intercept();
            const expected = [
                { pos: 0, codeIndex: 2, pattern: 'ab' },
                { pos: 2, codeIndex: 0, pattern: 'c' },
                { pos: 6, codeIndex: 1, pattern: 'b' },
                { pos: 8, codeIndex: 0, pattern: 'c' },
                { pos: 10, codeIndex: 2, pattern: 'ab' },
                { pos: 12, codeIndex: 0, pattern: 'c' }
            ];
            const actual = intercept.findPatterns("abc a b c abc", ["c", "b", "ab",]);
            expect(actual).toEqual(expected);
        });
    });
});
