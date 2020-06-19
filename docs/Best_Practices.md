# Best Practices
Here's an incomplete list of things that are inportant to consider when developing code to be controibuted to Bmore Responsive:


### Code Quality Standards

Regardless of Language:

- Default to `lowerCamelCase` naming convention
- Use static code analysis tools to improve code quality and consistency
- Code modifications within a repository should be performed on a branch, that will be merged to master via a pull request once approved.
- Provide meaningful code comments
- All commits must include a useful commit message

### Style Guides

Consistent style guidelines for each language should be used. Where possible, openly published standards by authorities providing or using the language will be used.

Example: Google has openly published style guides for many languages in wide use on their open source projects, and these can be adopted for use in this project: [Google Language Specific Styleguides](https://google.github.io/styleguide/)


### Static Code Analysis

Static code analysis tools should be used when possible, to monitor and improve code quality. This may be integrated in the local development environment, automated repository commit checks, automated CI/CD pipelines, or other steps in the code development process.

### Git and Branching

All code work should be done in an isolated or feature branch off of the `master` branch.  Before starting work on new code, developers should create their feature branch using a standard naming convention determined by the project.  

### Branch Names
Branch names should follow this pattern: `<your github username>/issue-<github issue number>`. This will ensure there are no branch name conflicts, and anyone looking for your branch will know what it is called based on the issue addressed. For example if your username was `letsGoOs`, and you were working on issue 8, then your branch name would be `letsGoOs/issue-8`. If you wanted to make a new branch to continue your work on your issue then add a suffix with an incremented number. To continue the previous example if you wanted to make a second branch for your issue 8 work your second branch would be called `letsGoOs/issue-8-2`.

### Merging and Pull Requests

When work is complete, and after static code analysis has been performed, the developer should submit a pull request in Github.  A pull request template has been provided, and developers should take care to fill out the form as completely as possible when submitting new pull requests omitting any sections that are deemed unnecessary for that particular submission.  Pull requests should require at least 1 review from another verified team member before they are approved and merged into the `master` branch.  

While not strictly required, it is recommended that pull requests are submitted early on in the development process with the intention of maintaining high visibility over the work while it is in progress.
