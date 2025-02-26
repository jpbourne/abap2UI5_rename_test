const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const yaml = require('js-yaml');

const xmlDirPath = '/workspaces/abap2UI5-renamed/dist/src/06/01/';
const yamlFilePath = '/workspaces/abap2UI5-renamed/build/frontend_renaming/config.yaml';

console.log('Starting the script...');

// Read YAML file
fs.readFile(yamlFilePath, 'utf8', (yamlErr, yamlData) => {
    if (yamlErr) {
        console.error('Error reading YAML file:', yamlErr);
        return;
    }
    console.log('YAML file read successfully.');

    // Parse YAML
    let yamlContent;
    try {
        yamlContent = yaml.load(yamlData);
        console.log('YAML file parsed successfully.');
    } catch (parseYamlErr) {
        console.error('Error parsing YAML file:', parseYamlErr);
        return;
    }

    // Extract dynamic value from YAML file
    const newName = yamlContent.new_name;
    console.log(`New name extracted from YAML file: ${newName}`);

    // Dynamically set the JSON file path
    const jsonFilePath = `/workspaces/abap2UI5-renamed/dist/src/06/02/${newName}.wapa.manifest.json`;
    console.log(`JSON file path set to: ${jsonFilePath}`);

    // Search for XML file in directory
    fs.readdir(xmlDirPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        console.log('Directory read successfully.');

        // Find XML file with the desired pattern
        const xmlFileName = files.find(file => file.startsWith(newName) && file.endsWith('.sicf.xml'));
        if (!xmlFileName) {
            console.error('No matching XML file found');
            return;
        }
        console.log(`XML file found: ${xmlFileName}`);

        const xmlFilePath = path.join(xmlDirPath, xmlFileName);

        // Read XML file
        fs.readFile(xmlFilePath, 'utf8', (err, xmlData) => {
            if (err) {
                console.error('Error reading XML file:', err);
                return;
            }
            console.log('XML file read successfully.');

            // Parse XML
            xml2js.parseString(xmlData, (parseErr, result) => {
                if (parseErr) {
                    console.error('Error parsing XML file:', parseErr);
                    return;
                }
                console.log('XML file parsed successfully.');

                // Extract URL from XML file
                const newUrl = result.abapGit?.['asx:abap']?.[0]?.['asx:values']?.[0]?.URL?.[0];
                if (!newUrl) {
                    console.error('No URL found in XML file');
                    return;
                }
                console.log(`URL extracted from XML file: ${newUrl}`);

                // Read JSON file
                fs.readFile(jsonFilePath, 'utf8', (jsonErr, jsonData) => {
                    if (jsonErr) {
                        console.error('Error reading JSON file:', jsonErr);
                        return;
                    }
                    console.log('JSON file read successfully.');

                    // Parse JSON
                    let jsonContent;
                    try {
                        jsonContent = JSON.parse(jsonData);
                        console.log('JSON file parsed successfully.');
                    } catch (parseJsonErr) {
                        console.error('Error parsing JSON file:', parseJsonErr);
                        return;
                    }

                    // Log the structure of the JSON file
                    console.log('JSON file structure:', JSON.stringify(jsonContent, null, 4));

                    // Replace URL in JSON file
                    if (jsonContent['sap.app'] && jsonContent['sap.app'].dataSources && jsonContent['sap.app'].dataSources.http && jsonContent['sap.app'].dataSources.http.uri) {
                        console.log(`Old URL in JSON file: ${jsonContent['sap.app'].dataSources.http.uri}`);
                        jsonContent['sap.app'].dataSources.http.uri = jsonContent['sap.app'].dataSources.http.uri.replace(yamlContent.old_name, newName);
                        console.log(`New URL in JSON file: ${jsonContent['sap.app'].dataSources.http.uri}`);
                    } else {
                        console.error('No URI found in JSON file');
                    }

                    // Save modified JSON file
                    fs.writeFile(jsonFilePath, JSON.stringify(jsonContent, null, 4), 'utf8', (writeErr) => {
                        if (writeErr) {
                            console.error('Error writing JSON file:', writeErr);
                            return;
                        }
                        console.log(`JSON file saved successfully. URL replaced with: ${jsonContent['sap.app'].dataSources.http.uri}`);
                    });
                });
            });
        });
    });
});