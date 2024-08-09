const axios = require('axios');
const { DateTime } = require('luxon');

const token = process.env.CLEAN_ARTIFACT_TOKEN;
const owner = 'praveen-frugal';
const repo = 'TestCleanArtifact';

// Calculate the cutoff date (e.g., 5 minutes ago)
const cutoffDate = DateTime.now().minus({ minutes: 5 }).toISO();

const headers = {
  'Authorization': `token ${token}`,
  'Accept': 'application/vnd.github.v3+json'
};

async function deleteOldArtifacts() {
  try {
    // List artifacts
    const artifactsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/actions/artifacts`, { headers });
    const artifacts = artifactsResponse.data.artifacts;

    for (const artifact of artifacts) {
      if (new Date(artifact.created_at) < new Date(cutoffDate)) {
        const artifactId = artifact.id;
        console.log(`Deleting artifact ${artifact.name} (ID: ${artifactId})`);
        await axios.delete(`https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifactId}`, { headers });
      }
    }
  } catch (error) {
    console.error('Error cleaning up artifacts:', error);
  }
}

deleteOldArtifacts();
