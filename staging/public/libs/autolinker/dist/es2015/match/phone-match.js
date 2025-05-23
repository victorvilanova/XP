import { __extends } from "tslib";
import { AbstractMatch } from './abstract-match';
/**
 * @class Autolinker.match.Phone
 * @extends Autolinker.match.AbstractMatch
 *
 * Represents a Phone number match found in an input string which should be
 * Autolinked.
 *
 * See this class's superclass ({@link Autolinker.match.Match}) for more
 * details.
 */
var PhoneMatch = /** @class */ (function (_super) {
    __extends(PhoneMatch, _super);
    /**
     * @method constructor
     * @param {Object} cfg The configuration properties for the Match
     *   instance, specified in an Object (map).
     */
    function PhoneMatch(cfg) {
        var _this = _super.call(this, cfg) || this;
        /**
         * @public
         * @property {'phone'} type
         *
         * A string name for the type of match that this class represents. Can be
         * used in a TypeScript discriminating union to type-narrow from the
         * `Match` type.
         */
        _this.type = 'phone';
        /**
         * @protected
         * @property {String} number (required)
         *
         * The phone number that was matched, without any delimiter characters.
         *
         * Note: This is a string to allow for prefixed 0's.
         */
        _this.number = ''; // default value just to get the above doc comment in the ES5 output and documentation generator
        /**
         * @protected
         * @property  {Boolean} plusSign (required)
         *
         * `true` if the matched phone number started with a '+' sign. We'll include
         * it in the `tel:` URL if so, as this is needed for international numbers.
         *
         * Ex: '+1 (123) 456 7879'
         */
        _this.plusSign = false; // default value just to get the above doc comment in the ES5 output and documentation generator
        _this.number = cfg.number;
        _this.plusSign = cfg.plusSign;
        return _this;
    }
    /**
     * Returns a string name for the type of match that this class represents.
     * For the case of PhoneMatch, returns 'phone'.
     *
     * @return {String}
     */
    PhoneMatch.prototype.getType = function () {
        return 'phone';
    };
    /**
     * Returns the phone number that was matched as a string, without any
     * delimiter characters.
     *
     * Note: This is a string to allow for prefixed 0's.
     *
     * @return {String}
     */
    PhoneMatch.prototype.getPhoneNumber = function () {
        return this.number;
    };
    /**
     * Alias of {@link #getPhoneNumber}, returns the phone number that was
     * matched as a string, without any delimiter characters.
     *
     * Note: This is a string to allow for prefixed 0's.
     *
     * @return {String}
     */
    PhoneMatch.prototype.getNumber = function () {
        return this.getPhoneNumber();
    };
    /**
     * Returns the anchor href that should be generated for the match.
     *
     * @return {String}
     */
    PhoneMatch.prototype.getAnchorHref = function () {
        return 'tel:' + (this.plusSign ? '+' : '') + this.number;
    };
    /**
     * Returns the anchor text that should be generated for the match.
     *
     * @return {String}
     */
    PhoneMatch.prototype.getAnchorText = function () {
        return this.matchedText;
    };
    return PhoneMatch;
}(AbstractMatch));
export { PhoneMatch };
//# sourceMappingURL=phone-match.js.map