"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidIpV4Address = exports.isValidTldMatch = exports.isValidSchemeUrl = exports.isKnownTld = exports.isUrlSuffixStartChar = exports.isPathChar = exports.isDomainLabelChar = exports.isDomainLabelStartChar = exports.isSchemeChar = exports.isSchemeStartChar = exports.tldUrlHostRe = exports.schemeUrlRe = exports.invalidSchemeRe = exports.urlSuffixedCharsNotAllowedAtEndRe = exports.httpSchemePrefixRe = exports.httpSchemeRe = exports.urlSuffixNotAllowedAsLastCharRe = exports.urlSuffixAllowedSpecialCharsRe = exports.urlSuffixStartCharsRe = exports.domainNameCharRegex = void 0;
var regex_lib_1 = require("../regex-lib");
var tld_regex_1 = require("./tld-regex");
/**
 * A regular expression that is simply the character class of the characters
 * that may be used in a domain name, minus the '-' or '.'
 */
exports.domainNameCharRegex = regex_lib_1.alphaNumericAndMarksRe;
/**
 * The set of characters that will start a URL suffix (i.e. the path, query, and
 * hash part of the URL)
 */
exports.urlSuffixStartCharsRe = /[\/?#]/;
/**
 * The set of characters that are allowed in the URL suffix (i.e. the path,
 * query, and hash part of the URL) which may also form the ending character of
 * the URL.
 *
 * The {@link #urlSuffixNotAllowedAsLastCharRe} are additional allowed URL
 * suffix characters, but (generally) should not be the last character of a URL.
 */
exports.urlSuffixAllowedSpecialCharsRe = /[-+&@#/%=~_()|'$*\[\]{}\u2713]/;
/**
 * URL suffix characters (i.e. path, query, and has part of the URL) that are
 * not allowed as the *last character* in the URL suffix as they would normally
 * form the end of a sentence.
 *
 * The {@link #urlSuffixAllowedSpecialCharsRe} contains additional allowed URL
 * suffix characters which are allowed as the last character.
 */
exports.urlSuffixNotAllowedAsLastCharRe = /[?!:,.;^]/;
/**
 * Regular expression to match an http:// or https:// scheme.
 */
exports.httpSchemeRe = /https?:\/\//i;
/**
 * Regular expression to match an http:// or https:// scheme as the prefix of
 * a string.
 */
exports.httpSchemePrefixRe = new RegExp('^' + exports.httpSchemeRe.source, 'i');
exports.urlSuffixedCharsNotAllowedAtEndRe = new RegExp(exports.urlSuffixNotAllowedAsLastCharRe.source + '$');
/**
 * A regular expression used to determine the schemes we should not autolink
 */
exports.invalidSchemeRe = /^(javascript|vbscript):/i;
// A regular expression used to determine if the URL is a scheme match (such as
// 'http://google.com', and as opposed to a "TLD match"). This regular
// expression is used to parse out the host along with if the URL has an
// authority component (i.e. '//')
//
// Capturing groups:
//    1. '//' if the URL has an authority component, empty string otherwise
//    2. The host (if one exists). Ex: 'google.com'
//
// See https://www.rfc-editor.org/rfc/rfc3986#appendix-A for terminology
exports.schemeUrlRe = /^[A-Za-z][-.+A-Za-z0-9]*:(\/\/)?([^:/]*)/;
// A regular expression used to determine if the URL is a TLD match (such as
// 'google.com', and as opposed to a "scheme match"). This regular
// expression is used to help parse out the TLD (top-level domain) of the host.
//
// See https://www.rfc-editor.org/rfc/rfc3986#appendix-A for terminology
exports.tldUrlHostRe = /^(?:\/\/)?([^/#?:]+)/; // optionally prefixed with protocol-relative '//' chars
/**
 * Determines if the given character may start a scheme (ex: 'http').
 */
function isSchemeStartChar(char) {
    return regex_lib_1.letterRe.test(char);
}
exports.isSchemeStartChar = isSchemeStartChar;
/**
 * Determines if the given character is a valid character in a scheme (such as
 * 'http' or 'ssh+git'), but only after the start char (which is handled by
 * {@link isSchemeStartChar}.
 */
function isSchemeChar(char) {
    return (regex_lib_1.letterRe.test(char) || regex_lib_1.digitRe.test(char) || char === '+' || char === '-' || char === '.');
}
exports.isSchemeChar = isSchemeChar;
/**
 * Determines if the character can begin a domain label, which must be an
 * alphanumeric character and not an underscore or dash.
 *
 * A domain label is a segment of a hostname such as subdomain.google.com.
 */
function isDomainLabelStartChar(char) {
    return regex_lib_1.alphaNumericAndMarksRe.test(char);
}
exports.isDomainLabelStartChar = isDomainLabelStartChar;
/**
 * Determines if the character is part of a domain label (but not a domain label
 * start character).
 *
 * A domain label is a segment of a hostname such as subdomain.google.com.
 */
function isDomainLabelChar(char) {
    return char === '_' || isDomainLabelStartChar(char);
}
exports.isDomainLabelChar = isDomainLabelChar;
/**
 * Determines if the character is a path character ("pchar") as defined by
 * https://tools.ietf.org/html/rfc3986#appendix-A
 *
 *     pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *
 *     unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *     pct-encoded   = "%" HEXDIG HEXDIG
 *     sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                   / "*" / "+" / "," / ";" / "="
 *
 * Note that this implementation doesn't follow the spec exactly, but rather
 * follows URL path characters found out in the wild (spec might be out of date?)
 */
function isPathChar(char) {
    return (regex_lib_1.alphaNumericAndMarksRe.test(char) ||
        exports.urlSuffixAllowedSpecialCharsRe.test(char) ||
        exports.urlSuffixNotAllowedAsLastCharRe.test(char));
}
exports.isPathChar = isPathChar;
/**
 * Determines if the character given may begin the "URL Suffix" section of a
 * URI (i.e. the path, query, or hash section). These are the '/', '?' and '#'
 * characters.
 *
 * See https://tools.ietf.org/html/rfc3986#appendix-A
 */
function isUrlSuffixStartChar(char) {
    return exports.urlSuffixStartCharsRe.test(char);
}
exports.isUrlSuffixStartChar = isUrlSuffixStartChar;
/**
 * Determines if the TLD read in the host is a known TLD (Top-Level Domain).
 *
 * Example: 'com' would be a known TLD (for a host of 'google.com'), but
 * 'local' would not (for a domain name of 'my-computer.local').
 */
function isKnownTld(tld) {
    return tld_regex_1.tldRegex.test(tld.toLowerCase()); // make sure the tld is lowercase for the regex
}
exports.isKnownTld = isKnownTld;
/**
 * Determines if the given `url` is a valid scheme-prefixed URL.
 */
function isValidSchemeUrl(url) {
    // If the scheme is 'javascript:' or 'vbscript:', these link
    // types can be dangerous. Don't link them.
    if (exports.invalidSchemeRe.test(url)) {
        return false;
    }
    var schemeMatch = url.match(exports.schemeUrlRe);
    if (!schemeMatch) {
        return false;
    }
    var isAuthorityMatch = !!schemeMatch[1];
    var host = schemeMatch[2];
    if (isAuthorityMatch) {
        // Any match that has an authority ('//' chars) after the scheme is
        // valid, such as 'http://anything'
        return true;
    }
    // If there's no authority ('//' chars), check that we have a hostname
    // that looks valid.
    //
    // The host must contain at least one '.' char and have a domain label
    // with at least one letter to be considered valid.
    //
    // Accept:
    //   - git:domain.com (scheme followed by a host
    // Do not accept:
    //   - git:something ('something' doesn't look like a host)
    //   - version:1.0   ('1.0' doesn't look like a host)
    if (host.indexOf('.') === -1 || !regex_lib_1.letterRe.test(host)) {
        return false;
    }
    return true;
}
exports.isValidSchemeUrl = isValidSchemeUrl;
/**
 * Determines if the given `url` is a match with a valid TLD.
 */
function isValidTldMatch(url) {
    // TLD URL such as 'google.com', we need to confirm that we have a valid
    // top-level domain
    var tldUrlHostMatch = url.match(exports.tldUrlHostRe);
    if (!tldUrlHostMatch) {
        // At this point, if the URL didn't match our TLD re, it must be invalid
        // (highly unlikely to happen, but just in case)
        return false;
    }
    var host = tldUrlHostMatch[0];
    var hostLabels = host.split('.');
    if (hostLabels.length < 2) {
        // 0 or 1 host label, there's no TLD. Ex: 'localhost'
        return false;
    }
    var tld = hostLabels[hostLabels.length - 1];
    if (!isKnownTld(tld)) {
        return false;
    }
    // TODO: Implement these conditions for TLD matcher:
    // (
    //     this.longestDomainLabelLength <= 63 &&
    //     this.domainNameLength <= 255
    // );
    return true;
}
exports.isValidTldMatch = isValidTldMatch;
// Regular expression to confirm a valid IPv4 address (ex: '192.168.0.1')
var ipV4Re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
// Regular expression used to split the IPv4 address itself from any port/path/query/hash
var ipV4PartRe = /[:/?#]/;
/**
 * Determines if the given URL is a valid IPv4-prefixed URL.
 */
function isValidIpV4Address(url) {
    // Grab just the IP address
    var ipV4Part = url.split(ipV4PartRe, 1)[0]; // only 1 result needed
    return ipV4Re.test(ipV4Part);
}
exports.isValidIpV4Address = isValidIpV4Address;
//# sourceMappingURL=uri-utils.js.map