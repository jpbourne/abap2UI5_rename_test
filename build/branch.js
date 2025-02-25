const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Pfad zur Konfigurationsdatei
const configPath = path.join(__dirname, 'config-build.jsonc');

// Konfigurationsdatei lesen und parsen
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const branchName = config.branchName;

const srcDir = path.join(__dirname, '../dist');

try {
  // Check if src directory exists
  if (!fs.existsSync(srcDir)) {
    throw new Error(`Directory ${srcDir} does not exist.`);
  }

  // Stash untracked files
  execSync('git add -A');
  execSync('git stash');
  console.log('Stashed untracked files');

  // Check if the branch already exists
  const branches = execSync('git branch --list').toString();
  if (branches.includes(branchName)) {
    // Switch to a different branch before deleting the existing branch
    execSync('git checkout main');
    console.log('Switched to branch main');

    // Delete the existing branch
    execSync(`git branch -D ${branchName}`);
    console.log(`Deleted existing branch '${branchName}'`);
  }

  // Create a new branch
  execSync(`git checkout -b ${branchName}`);
  console.log(`Switched to new branch '${branchName}'`);

  // Remove all files from the index
  execSync('git rm -r --cached .');
  console.log('Removed all files from the index');

  // Add the contents of the src directory to the index, including hidden files
  execSync(`git add ${srcDir}/. && git add ${srcDir}/* -f`);
  console.log(`Added contents of ${srcDir} to the index`);

  // Commit the changes
  execSync(`git commit -m 'Add src contents to ${branchName} branch'`);
  console.log('Committed the changes');

  // Push the new branch to the remote repository
  execSync(`git push origin ${branchName} --force`);
  console.log(`Pushed branch '${branchName}' to remote repository`);

} catch (error) {
  console.error(`Error: ${error.message}`);
}