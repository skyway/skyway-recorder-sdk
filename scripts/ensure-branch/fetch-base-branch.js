const Octokit = require('@octokit/rest');

module.exports = async function fetchBaseBranch(prNumber, { GITHUB_TOKEN }) {
  const octokit = new Octokit({ auth: `token ${GITHUB_TOKEN}` });

  const {
    data: {
      base: { ref },
    },
  } = await octokit.pulls.get({
    owner: 'skyway',
    repo: 'skyway-recorder-sdk',
    pull_number: prNumber,
  });

  return ref;
};
