import { __extends } from "tslib";
import { AbstractMatch } from './abstract-match';
import { httpSchemePrefixRe } from '../parser/uri-utils';
/**
 * A regular expression used to remove the 'www.' from URLs.
 */
var wwwPrefixRegex = /^(https?:\/\/)?(www\.)?/i;
/**
 * The regular expression used to remove the protocol-relative '//' from a URL
 * string, for purposes of formatting the anchor text. A protocol-relative URL
 * is, for example, "//yahoo.com"
 */
var protocolRelativeRegex = /^\/\//;
/**
 * @class Autolinker.match.Url
 * @extends Autolinker.match.AbstractMatch
 *
 * Represents a Url match found in an input string which should be Autolinked.
 *
 * See this class's superclass ({@link Autolinker.match.Match}) for more details.
 */
var UrlMatch = /** @class */ (function (_super) {
    __extends(UrlMatch, _super);
    /**
     * @method constructor
     * @param {Object} cfg The configuration properties for the Match
     *   instance, specified in an Object (map).
     */
    function UrlMatch(cfg) {
        var _this = _super.call(this, cfg) || this;
        /**
         * @public
         * @property {'url'} type
         *
         * A string name for the type of match that this class represents. Can be
         * used in a TypeScript discriminating union to type-narrow from the
         * `Match` type.
         */
        _this.type = 'url';
        /**
         * @cfg {String} url (required)
         *
         * The url that was matched.
         */
        _this.url = ''; // default value just to get the above doc comment in the ES5 output and documentation generator
        /**
         * @cfg {"scheme"/"www"/"tld"} urlMatchType (required)
         *
         * The type of URL match that this class represents. This helps to determine
         * if the match was made in the original text with a prefixed scheme (ex:
         * 'http://www.google.com'), a prefixed 'www' (ex: 'www.google.com'), or
         * was matched by a known top-level domain (ex: 'google.com').
         */
        _this.urlMatchType = 'scheme'; // default value just to get the above doc comment in the ES5 output and documentation generator
        /**
         * @cfg {Boolean} protocolRelativeMatch (required)
         *
         * `true` if the URL is a protocol-relative match. A protocol-relative match
         * is a URL that starts with '//', and will be either http:// or https://
         * based on the protocol that the site is loaded under.
         */
        _this.protocolRelativeMatch = false; // default value just to get the above doc comment in the ES5 output and documentation generator
        /**
         * @cfg {Object} stripPrefix (required)
         *
         * The Object form of {@link Autolinker#cfg-stripPrefix}.
         */
        _this.stripPrefix = {
            scheme: true,
            www: true,
        }; // default value just to get the above doc comment in the ES5 output and documentation generator
        /**
         * @cfg {Boolean} stripTrailingSlash (required)
         * @inheritdoc Autolinker#cfg-stripTrailingSlash
         */
        _this.stripTrailingSlash = true; // default value just to get the above doc comment in the ES5 output and documentation generator
        /**
         * @cfg {Boolean} decodePercentEncoding (required)
         * @inheritdoc Autolinker#cfg-decodePercentEncoding
         */
        _this.decodePercentEncoding = true; // default value just to get the above doc comment in the ES5 output and documentation generator
        /**
         * @private
         * @property {Boolean} protocolPrepended
         *
         * Will be set to `true` if the 'http://' protocol has been prepended to the {@link #url} (because the
         * {@link #url} did not have a protocol)
         */
        _this.protocolPrepended = false;
        _this.urlMatchType = cfg.urlMatchType;
        _this.url = cfg.url;
        _this.protocolRelativeMatch = cfg.protocolRelativeMatch;
        _this.stripPrefix = cfg.stripPrefix;
        _this.stripTrailingSlash = cfg.stripTrailingSlash;
        _this.decodePercentEncoding = cfg.decodePercentEncoding;
        return _this;
    }
    /**
     * Returns a string name for the type of match that this class represents.
     * For the case of UrlMatch, returns 'url'.
     *
     * @return {String}
     */
    UrlMatch.prototype.getType = function () {
        return 'url';
    };
    /**
     * Returns a string name for the type of URL match that this class
     * represents.
     *
     * This helps to determine if the match was made in the original text with a
     * prefixed scheme (ex: 'http://www.google.com'), a prefixed 'www' (ex:
     * 'www.google.com'), or was matched by a known top-level domain (ex:
     * 'google.com').
     *
     * @return {"scheme"/"www"/"tld"}
     */
    UrlMatch.prototype.getUrlMatchType = function () {
        return this.urlMatchType;
    };
    /**
     * Returns the url that was matched, assuming the protocol to be 'http://' if the original
     * match was missing a protocol.
     *
     * @return {String}
     */
    UrlMatch.prototype.getUrl = function () {
        var url = this.url;
        // if the url string doesn't begin with a scheme, assume 'http://'
        if (!this.protocolRelativeMatch &&
            this.urlMatchType !== 'scheme' &&
            !this.protocolPrepended) {
            url = this.url = 'http://' + url;
            this.protocolPrepended = true;
        }
        return url;
    };
    /**
     * Returns the anchor href that should be generated for the match.
     *
     * @return {String}
     */
    UrlMatch.prototype.getAnchorHref = function () {
        var url = this.getUrl();
        return url.replace(/&amp;/g, '&'); // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html
    };
    /**
     * Returns the anchor text that should be generated for the match.
     *
     * @return {String}
     */
    UrlMatch.prototype.getAnchorText = function () {
        var anchorText = this.getMatchedText();
        if (this.protocolRelativeMatch) {
            // Strip off any protocol-relative '//' from the anchor text
            anchorText = stripProtocolRelativePrefix(anchorText);
        }
        if (this.stripPrefix.scheme) {
            anchorText = stripSchemePrefix(anchorText);
        }
        if (this.stripPrefix.www) {
            anchorText = stripWwwPrefix(anchorText);
        }
        if (this.stripTrailingSlash) {
            anchorText = removeTrailingSlash(anchorText); // remove trailing slash, if there is one
        }
        if (this.decodePercentEncoding) {
            anchorText = removePercentEncoding(anchorText);
        }
        return anchorText;
    };
    return UrlMatch;
}(AbstractMatch));
export { UrlMatch };
// Utility Functionality
/**
 * Strips the scheme prefix (such as "http://" or "https://") from the given
 * `url`.
 *
 * @private
 * @param {String} url The text of the anchor that is being generated, for
 *   which to strip off the url scheme.
 * @return {String} The `url`, with the scheme stripped.
 */
function stripSchemePrefix(url) {
    return url.replace(httpSchemePrefixRe, '');
}
/**
 * Strips the 'www' prefix from the given `url`.
 *
 * @private
 * @param {String} url The text of the anchor that is being generated, for
 *   which to strip off the 'www' if it exists.
 * @return {String} The `url`, with the 'www' stripped.
 */
function stripWwwPrefix(url) {
    return url.replace(wwwPrefixRegex, '$1'); // leave any scheme ($1), it one exists
}
/**
 * Strips any protocol-relative '//' from the anchor text.
 *
 * @private
 * @param {String} text The text of the anchor that is being generated, for which to strip off the
 *   protocol-relative prefix (such as stripping off "//")
 * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
 */
function stripProtocolRelativePrefix(text) {
    return text.replace(protocolRelativeRegex, '');
}
/**
 * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
 *
 * @private
 * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
 *   slash ('/') that may exist.
 * @return {String} The `anchorText`, with the trailing slash removed.
 */
function removeTrailingSlash(anchorText) {
    if (anchorText.charAt(anchorText.length - 1) === '/') {
        anchorText = anchorText.slice(0, -1);
    }
    return anchorText;
}
/**
 * Decodes percent-encoded characters from the given `anchorText`, in
 * preparation for the text to be displayed.
 *
 * @private
 * @param {String} anchorText The text of the anchor that is being
 *   generated, for which to decode any percent-encoded characters.
 * @return {String} The `anchorText`, with the percent-encoded characters
 *   decoded.
 */
function removePercentEncoding(anchorText) {
    // First, convert a few of the known % encodings to the corresponding
    // HTML entities that could accidentally be interpretted as special
    // HTML characters
    var preProcessedEntityAnchorText = anchorText
        .replace(/%22/gi, '&quot;') // " char
        .replace(/%26/gi, '&amp;') // & char
        .replace(/%27/gi, '&#39;') // ' char
        .replace(/%3C/gi, '&lt;') // < char
        .replace(/%3E/gi, '&gt;'); // > char
    try {
        // Now attempt to decode the rest of the anchor text
        return decodeURIComponent(preProcessedEntityAnchorText);
    }
    catch (e) {
        // Invalid % escape sequence in the anchor text
        return preProcessedEntityAnchorText;
    }
}
//# sourceMappingURL=url-match.js.map