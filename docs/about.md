# About Bmore Responsive

Here some more info about this project.

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

## Current Work

We use GitHub issues to define and manage our work.  The [list of open issues](https://github.com/CodeForBaltimore/Bmore-Responsive/issues) describes the work that is currently on our plate.  [GitHub milestones](https://github.com/CodeForBaltimore/Bmore-Responsive/milestones) are occasionally used to represent features from the story map.  Often several issues (user stories, bugs, tasks, etc) will be related to one feature.  By relating these issues to a milestone, it makes it easy to view/track progress toward features on the story map.

## Technology and Code

This project will make exclusive use of open-source software, packages, and contributions. The application is built with the following
technologies:

- Javascript (ES6)
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/v3/)
- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)

Please see our [Developer Intro](DevIntro.md) for a full breakdown of the project and workflows.

Please see our [Best Practices](Best_Practices.md) for code standards, git standards, and other guidance for writing clean and well
documented code.

## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue,
email, slack, or any other method with the contributes of this repository, or Code for Baltimore, before making a change.

Please note we have a [Code of Conduct](Code_of_Conduct.md), please follow it in all your interactions with the project.

## Definition of Done

Before any issue can be considered done and marked resolved, the following conditions must be met:

- All Acceptance criteria listed in the issue are fulfilled
- The Postman collection on the branch passes all tests
- The Swagger doc completely and accurately aligns with the implementation of the API
- All documentation, especially wiki pages in `/docs/*.md`, aligns with updated code/solution
- All unit tests pass
- Unit test coverage, as measured by Codecov, is 80%
- No medium or major security vulnerabilities

## Pull Request Process
1. Ensure you thoroughly fill out the pull request form presented when submitting the request.
   This includes listing what work was done, what issues are resolved by that work, what tests
   have been added, how to perform other tests or run the code, and other potentially relevant
   notes.
2. Make sure that all elements of the *Definition of Done* (above) are met.  Feel free to ask for help if needed.
3. If you are on the project team you may merge the Pull Request in once you have the sign-off of one other developer, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Contact Us
The best ways to get in touch with us is via Slack. An active Slack link can be found on our website:

***[codeforbaltimore.org](https://codeforbaltimore.org/)***

You can also reach out to the tech lead [Jason Anton](https://github.com/revjtanton) via email at [jason@codeforbaltimore.org](mailto:jason@codeforbaltimore.org).

CodeForBaltimore welcomes anyone who is interested in helping with this project.  You do not have to be an expert developer or located anywhere near Baltimore.  Hit us up on Slack and let's talk.

## Sources and Links
We are also building a front-end application called [Healthcare Rollcall](https://github.com/CodeForBaltimore/Healthcare-Rollcall) to interact
with this backend API. To view that project, or to contribute to it, please visit the repo here: https://github.com/CodeForBaltimore/Healthcare-Rollcall
