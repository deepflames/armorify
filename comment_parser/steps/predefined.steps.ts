export const predefinedSteps_300_rc9 = `
/**
* Opens the applications main drawer
* @name "GivenOpenDrawer"
* @category "Pre-defined"
* @pattern "I (open|close) the drawer"
* @param {string} action
*
* @sample
* Given I open the drawer
*/

/**
* Discovers a widget by its text within the same parent
* @name "SiblingContainsTextStep"
* @category "Pre-defined"
* @pattern I expect a {string} that contains the text {string} to also contain the text {string}
* @param {string} ancestorType
* @param {string} leadingText
* @param {string} valueText
* @param {string} context
*
* @sample
* Then I expect a "Row" that contains the text "X" to also contain the text "Y"
* @desc
* For example, discovering X while only being aware of Y:
* Row(children: [
*   Text('Y'),
*   Text('X')
* ])
*/
`;
