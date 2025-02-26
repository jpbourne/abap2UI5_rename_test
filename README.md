# abap2UI5-builder

Automatically create your own abap2UI5 build. Choose your language version and the addons you need.

Features:
* Integrates abap2UI5, frontend, and multiple addons into a single project
* Rename all artifacts to your custom namespace
* Supports running multiple builds on the same system
* Install your new build with a single abapGit pull

Find default builds for various use cases [here.](https://github.com/abap2UI5/build)

### Build Process
1. Adjust the configuration for your build process [here:](./setup/build.jsonc)
```json
{
  "abap_version": "Cloud",
  "repositories": [
    "abap2UI5",
    "layout-variant-management",
    "table-maintenance"
  ]
}
```
Run the clone process:
```
npm run clone
```
2. (optional) Set up a renaming process [here](./setup/rename.jsonc) and run it with:

```
npm run rename
```
3. (optional) Add static code checks with abaplint [here:](./setup/abaplint.jsonc)
```
npm run abaplint
```
4. Find your newly generated abapGit project in the `dist` folder. Create a new build branch with:
```
npm run branch
git checkout -b build
git add .
git commit -m "my new build"
git push origin build --force
```
5. Pull this branch to your ABAP system, and you're ready to go.

### Automate with GitHub Actions
You can automate this process via github action by using the command:
```sh
npm run build
```

### Supported Projects
The following projects are supported:

| Name      | Renaming | Cloud | v750 | v702 |
|-----------|----------|--------------|-------------|-------------|
| [abap2UI5](https://github.com/abap2UI5/abap2UI5) | X     | X         | X        | X         |
| [samples](https://github.com/abap2UI5/samples)   |     | X        | X    | X         |
| [layout-variant-management](https://github.com/abap2UI5-addons/layout-variant-management)   | X    | X        | X    |          |
| [table-maintenance](https://github.com/abap2UI5-addons/table-maintenance)   | X    | X        | X    |          |

Your project is not listed here? Feel free to send a PR and extend the list [here.](https://github.com/abap2UI5/builder/blob/main/setup/config-repos.jsonc)

###### Legend
* Cloud: S/4 Public Cloud, BTP ABAP Environment
* v750: S/4 Private Cloud, S/4 On-Premise, R/3 NetWeaver 750
* v702: R/3 NetWeaver <750

### Concept
<img width="700" alt="image" src="https://github.com/user-attachments/assets/bad5ed8e-2fa3-4ce4-a0d1-fcd1608b4984" />


###### Namespace
All artifacts are generated under the namespace `zabap2ui5`. This differs from the main repository to allow both versions to coexist on the same system. One version for modifications and contributions (z2ui5), this one for productive usage (zabap2ui5). Just change the `build.json` for the use of your custom namespace.

### Limitations & Todo
* Renaming for Frontend with customer namespace eg. `/ZZZ/` [[1493]](https://github.com/abap2UI5/abap2UI5/issues/1493)

### Credits
* Automagic standalone renaming of ABAP objects [(SCN - 20.02.2021)](https://community.sap.com/t5/application-development-blog-posts/automagic-standalone-renaming-of-abap-objects/ba-p/13499851)
* Static Code Checks via [abaplint](https://abaplint.org/) [(contributors)](https://github.com/abaplint/abaplint/graphs/contributors) 

### Issues
For bug reports or feature requests, please open an issue in the main repository [here.](https://github.com/abap2UI5/abap2UI5/issues)
