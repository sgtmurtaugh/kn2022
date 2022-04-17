import { LoremIpsum } from "../../node_modules/lorem-ipsum";
import { FORMAT_HTML } from "../../node_modules/lorem-ipsum/dist/constants/formats";
import { UNIT_PARAGRAPH, UNIT_PARAGRAPHS, UNIT_SENTENCE, UNIT_SENTENCES, UNIT_WORD, UNIT_WORDS } from "../../node_modules/lorem-ipsum/dist/constants/units";

/**
 * random
 * @param count - number of words, sentences or paragraphs
 * @param unit - one of word, words, sentence, sentences, paragraph or paragraphs
 * @param format - plain or html
 * <p>TODO
 */
module.exports = function(count, unit, format) {
    let _unit = unit || UNIT_PARAGRAPH;
    let _format = format || FORMAT_HTML;

    const lorem = new LoremIpsum( {
        count: 1,                // Number of "words", "sentences", or "paragraphs"
        format: _format,          // "plain" or "html"
        paragraphLowerBound: 3,  // Min. number of sentences per paragraph.
        paragraphUpperBound: 7,  // Max. number of sentences per paragarph.
        random: Math.random,     // A PRNG function
        sentenceLowerBound: 5,   // Min. number of words per sentence.
        sentenceUpperBound: 15,  // Max. number of words per sentence.
        suffix: "\n",            // Line ending, defaults to "\n" or "\r\n" (win32)
        units: _unit,      // paragraph(s), "sentence(s)", or "word(s)"
    }, _format );

    switch (_unit) {
        case UNIT_PARAGRAPH:
        case UNIT_PARAGRAPHS:
            return lorem.generateParagraphs(count);
        case UNIT_SENTENCE:
        case UNIT_SENTENCES:
            return lorem.generateSentences(count);
        case UNIT_WORD:
        case UNIT_WORDS:
            return lorem.generateWords(count);
        default:
            return "";
    }


}