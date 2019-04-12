const semver = require('semver');

const rangeRegex = /^([=v^~]|>=)?\d+\.\d+\.\d+[^ |]*$/;
const latestRegex = /^\d+\.\d+\.\d+$/;

const updateRange = (range, latest, versions) => {
  if (!latestRegex.test(latest)) {
    return null;
  }

  const match = range.match(rangeRegex);

  if (match === null) {
    return null;
  }

  const updatedRange = `${match[1] || ''}${latest}`;

  // Validate that the new range contains only the latest version.
  for (let i = 0, len = versions.length; i < len; i++) {
    const version = versions[i];

    if (semver.satisfies(version, updatedRange) && version !== latest) {
      return null;
    }
  }

  return updatedRange;
};

module.exports = updateRange;
