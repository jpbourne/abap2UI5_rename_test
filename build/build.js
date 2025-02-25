const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the config file path from the command line argument or use the default
const args = process.argv.slice(2);
const configArgIndex = args.indexOf('--config');
const configFilePath = configArgIndex !== -1 && args[configArgIndex + 1] ? args[configArgIndex + 1] : path.join(__dirname, 'build.json');

// Load configuration from the JSON file
const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
//const reposConfig = JSON.parse(fs.readFileSync(path.join(__dirname, config.config_repos), 'utf8'));
const reposConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './config-repos.jsonc' ), 'utf8'));
const repos = reposConfig.repos;
const activeRepos = config.repositories;
const selectedBranch = config.abap_version;

// Load paths from the separate JSON file
const pathsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config-build.jsonc'), 'utf8'));
const inputDir = path.join(__dirname, '..', pathsConfig.input);
const outputDir = path.join(__dirname, '..', pathsConfig.output);

// Ensure the input directory exists
if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir);
}

// Ensure the src directory is deleted if it exists
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

// Create the src directory
fs.mkdirSync(outputDir);

// Pfad zum Template-Ordner
const templateDir = path.join(__dirname, 'template');

// Kopiere alle Dateien aus dem Template-Ordner in den Zielordner
if (fs.existsSync(templateDir)) {
  fs.cpSync(templateDir, outputDir, { recursive: true });
  console.log(`Alle Dateien aus dem Template-Ordner wurden erfolgreich in den Zielordner kopiert.`);
} else {
  console.error(`Template-Ordner nicht gefunden.`);
}

repos.forEach(repo => {
  if (!activeRepos.includes(repo.name)) {
    return;
  }

  const branch = repo.branches[selectedBranch];
  if (!branch) {
    console.error(`Branch ${selectedBranch} not found for repository ${repo.url}`);
    return;
  }

  const repoName = repo.url.split('/').pop();
  const cloneDir = path.join(inputDir, repoName);

  // Check if the directory exists and is not empty, and delete it if necessary
  if (fs.existsSync(cloneDir)) {
    fs.rmSync(cloneDir, { recursive: true, force: true });
  }

  exec(`git clone --branch ${branch} ${repo.url} ${cloneDir}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error cloning ${repo.url}:`, stderr);
      return;
    }

    console.log(`Successfully cloned: ${repo.url}`);
    
    const sourcePath = path.join(cloneDir, repo.sourceDir);
    const targetPath = path.join(outputDir, '/src' , repo.targetDir);

    // Check if the target directory exists and delete it if necessary
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    }

    if (fs.existsSync(sourcePath)) {
      fs.cpSync(sourcePath, targetPath, { recursive: true });
      console.log(`Directory ${repo.sourceDir} from ${repoName} successfully copied to ${repo.targetDir}.`);
    } else {
      console.error(`Directory ${repo.sourceDir} not found in ${repoName}`);
    }
  });
});

// Log message if no repository found for a name
activeRepos.forEach(activeRepo => {
  if (!repos.some(repo => repo.name === activeRepo)) {
    console.error(`No repository found for name: ${activeRepo}`);
  }
});

// Add JSON content and timestamp to dist/README.md
const readmePath = path.join(__dirname, '..', 'dist', 'README.md');
const buildJsonContent = fs.readFileSync(configFilePath, 'utf8');
const timestamp = new Date().toLocaleString('en-EN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

const readmeContent = `

### Configuration (build.jsonc)

\`\`\`json
${buildJsonContent}
\`\`\`

### Timestamp

Created at: ${timestamp}
`;

fs.appendFileSync(readmePath, readmeContent);
