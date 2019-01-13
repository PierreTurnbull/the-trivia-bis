/**
 * Update a field in the state of a class and persist it into the localStorage
 * @param {object} that: access to the class
 * @param {string} field: the field that will be updated and persisted
 * @param {number} value: the value used to increment the field
 */
const updateAndPersist = (that, field, value) => {
  let stateData = {};

  stateData[field] = value;
  that.setState(stateData, () => {
    localStorage[`${that.state.category.id}-${field}`] = that.state[field];
  });
}

/**
 * Retrieve a category value from the localStorage, or a default value
 * @param {object} that: access to the class
 * @param {*} field: the field
 * @param {number} categoryId: the category id
 */
const getLocalValue = (that, field, categoryId) => {
  const localValue = localStorage[`${categoryId}-${field}`];

  return (
    localValue !== undefined
      ? Number(localValue)
      : that.state.defaults[field]
  );
}

export default {
  updateAndPersist,
  getLocalValue
};