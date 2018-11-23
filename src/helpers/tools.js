/**
 * Increment a field in the state of a class
 * @param {object} that: access to the class
 * @param {string} field: the field that will be incremented
 * @param {number} value: the value used to increment the field
 */
const incrementCategoryData = (that, field, value) => {
  let stateData = {};

  stateData[field] = that.state[field] + value;
  that.setState(stateData, () => {
    localStorage[`${that.state.category.id}-${field}`] = that.state[field];
  });
}

export default {
  incrementCategoryData
};