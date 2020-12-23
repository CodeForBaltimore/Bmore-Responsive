# Welcome

The CodeForBaltimore team is thrilled that you might be interested in helping us help others. You do not need to be an expert, just willing to help.  This page will give you some background on this project with suggestion and advice on how to contribute.

## What is Bmore Responsive?

A simple, flexible API to support emergency response coordination.  Sample use cases include:

- keeping track of local nursing home status and needs during a global pandemic
- identifying hospitals lacking power during a natural disaster
- assuring safety of hikers in a national park during a snow storm

This system will make use of digital services and modern methodologies to automate and simplify parts of the check-in process
to help the municipality prioritize its call/check-in list and response plan. Additionally, the system will validate contact
information regularly during non-emergency times to ensure the municipality has the most up-to-date information for each entity.

## What Bmore Responsive Isn't?

In order to stay focus on its primary goals, Bmore Responsive is **not** intended to:

- Be a front-end website or app
- Provide statistical or analytical endpoints
- Be a robust questionnaire design tool

## Roadmap

The project team uses a [User Story Map](https://www.jpattonassociates.com/user-story-mapping/) to identify feature planned for future development.  Here's our latest story map:

![StoryMap](https://app.lucidchart.com/publicSegments/view/284f3228-4d57-476d-b00c-f6b8cbfa74f4/image.jpeg)
<p align="center"><i>Bmore Responsive User Story Map</i></p>

Additionally, we have an [API Roadmap page](https://github.com/CodeForBaltimore/Bmore-Responsive/wiki/API-Roadmap) in our GitHub wiki describing plans for the next major version of this API.

## Current Work and Help Needed

We use GitHub issues to define and manage our work.  The [list of open issues](https://github.com/CodeForBaltimore/Bmore-Responsive/issues) describes the work that is currently on our plate.  These issues include work that is being done as well as enhancements and defect fixes that need help.  [GitHub milestones](https://github.com/CodeForBaltimore/Bmore-Responsive/milestones) are occasionally used to represent features from the story map.  Often several issues (user stories, bugs, tasks, etc) will be related to one feature.  By relating these issues to a milestone, it makes it easy to view/track progress toward features on the story map.

If you are looking to help, we recommend that you review the issues listed to identify an opportunity to contribute. You are also free to create an issue to suggest a change. Keep an eye on the labels associated with each issue.  The labels will typically indicate the type and importance of the work.  Some commonly used labels and their meanings are:

- `good first issue` is a relatively simple issue appropriate for someone new to the project
- `P1`, `P2`, `P3` each describe priority with P1 being the most urgent
- `bug` is a defect that needs to be fixed
- `enhancement` is a new valuable new feature 

## Technology and Code

This project will make exclusive use of open-source software, packages, and contributions. The application is built with the following
technologies:

- Javascript (ES6)
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/v3/)
- [Casbin](https://casbin.org/en/)
- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [Postman](https://www.postman.com)

Please see our [Developer Intro](DevIntro.md) for a full breakdown of the architecture of the projects and important scripts.

## Contributing

### Git Workflow

Here's a summary of the steps needed to the Bmore Responsive repo:

1. First fork then this repo
2. Clone the forked repo locally
3. Add a remote that points to the original repo and name it upstream.
4. Manually sync up with upstream by running get fetch upstream followed by git status to take a look. If necessary, pull in any changes.
5. Create a branch off of master and start coding (see *Naming Branches*)
6. Add, commit, and push up the branch (to your fork).
7. Check for any merge conflicts or unintended changes between your branch and the original repo's master branch. If it looks good, create a pull request.

If you are new to GitHub and/or this workflow there is a [great, brief tutorial on Egghead](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

### Naming Branches
 Branch names should follow this pattern: `<your github username>/issue-<github issue number>`. This will ensure there are no branch name conflicts, and anyone looking for your branch will know what it is called based on the issue addressed. For example if your username was `letsGoOs`, and you were working on issue 8, then your branch name would be `letsGoOs/issue-8`. If you wanted to make a new branch to continue your work on your issue then add a suffix with an incremented number. To continue the previous example if you wanted to make a second branch for your issue 8 work your second branch would be called `letsGoOs/issue-8-2`.


### Definition of Done

Before any issue can be considered done and marked resolved, the following conditions must be met:

- All Acceptance criteria listed in the issue are fulfilled
- The Postman collection on the branch passes all tests
- The Swagger doc completely and accurately aligns with the implementation of the API
- All documentation, especially wiki pages in `/docs/*.md`, aligns with updated code/solution
- All unit tests pass
- Unit test coverage, as measured by Codecov, is 80%
- No medium or major security vulnerabilities

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

## Contact Us
The best ways to get in touch with us is via [our Slack workspace](https://join.slack.com/t/codeforbaltimoreteam/shared_invite/zt-4m78ibqc-_fWcn4XLoqm2rQ661csgbA_). 

You can also reach out to our tech lead [Jason Anton](https://github.com/revjtanton) via email at [jason@codeforbaltimore.org](mailto:jason@codeforbaltimore.org) or our delivery lead [Bill Lakenan](https://github.com/blakenan-bellese) via email at [bill@codeforbaltimore.org](mailto:bill@codeforbaltimore.org)

CodeForBaltimore welcomes anyone who is interested in helping with this project.  You do not have to be an expert developer or located anywhere near Baltimore.  Hit us up on Slack and let's talk.

Please note we have a [Code of Conduct](Code_of_Conduct.md), please follow it in all your interactions with the project.

## Sources and Links
We are also building a front-end application called [Healthcare Rollcall](https://github.com/CodeForBaltimore/Healthcare-Rollcall) to interact with this backend API.  We welcome interest and contributions to both repos.  
