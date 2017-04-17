/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * Given the identifier for an action/helper/etc, invent an appropriate description.
 * (i.e. <140 characters, in the imperative mood, sentence case, and so on)
 *
 * @param  {String} identifier
 * @returns {String}
 */
module.exports = function inventDescription (identifier){

  // Support slashes or dots:
  identifier = identifier.replace(/\/+/g, '.');

  // FOR REFERENCE:
  //
  // user/create           => Create user.
  // signup                => Signup something.
  // user/signup           => Signup user.
  // channel/ban-all-users => Ban all users.
  // channel/destroy-all   => Destroy all.
  // channel/destroy       => Destroy channel.
  // api/v2/stock/sell     => Sell stock.
  // api/v2/stock/sell-all => Sell all.
  var chunks = identifier.split('.');
  var lastChunk = _.last(chunks);
  var verbWord = _.words(lastChunk)[0];
  if (_.words(lastChunk).length === 1 && chunks.length === 1) {
    return _.capitalize(verbWord) + ' something.';
  }
  else if (_.words(lastChunk).length === 1 && chunks.length > 1) {
    var secondToLastChunk = chunks.slice(-2, -1)[0];
    var akkusativ = _.words(secondToLastChunk);
    var midSentenceCaseAkkusativ = _.map(_.words(akkusativ), function (word){ return word[0].toLowerCase() + word.slice(1); }).join(' ');
    return _.capitalize(verbWord)+' '+midSentenceCaseAkkusativ+'.';
  }
  else {
    // We could go with `inferredDescription = sentenceCaseStem+'.'`, but it's not worth it
    // since that's just identical to the sentence-case stem pretty much.  So instead, we
    // leave this as empty string so that it can be handled on a case-by-case basis.
    return '';
  }

};
