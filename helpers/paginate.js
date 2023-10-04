const { DEFAULT_PAGE_SIZE } = require('../config');

/**
 * Pagination Handler
 */
const paginate = ({ page = 1, limit: size = DEFAULT_PAGE_SIZE } = {}) => {
  const p = parseInt(page, 10);
  const s = parseInt(size, 10);

  if (p < 1) {
    throw new Error('Invalid page number');
  }

  const offset = (p - 1) * s;
  const limit = s;

  return {
    offset,
    limit,
  };
};

/**
 * Returns next page if available, null if otherwise
 */
const getNextPage = ({ count = 0, page = 1, limit = DEFAULT_PAGE_SIZE } = {}) => {
  const p = parseInt(page, 10);
  const l = parseInt(limit, 10);

  return count > l * p ? p + 1 : null;
};



module.exports = { paginate, getNextPage };
