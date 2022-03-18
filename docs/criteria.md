# Criteria description for the Dependency Health Monitor
This page describes the criteria used in the Dependency Health Monitor, how they are scored, and how they are weighed for the final score. The criteria can change over time and community feedback is welcome. If you have ideas for additions or new scoring techniques, please contribute!

## Quick overview of criteria
| Criteria                                         | Description                                                                                                                | Priority   |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [Sustainability of core contributors/maintainers](#sustainability-of-core-contributorsmaintainers)  | Describes how the income (received funding) compares with the costs of the project (cost of core contributors/maintainers) | High       |
| [Organisational activity](#organisational-activity)                          | Indicates how many percent of all contributions come from contributors which are part of an organisation                   | High       |
| [Acceptance of funding](#acceptance-of-funding)                            | Shows if the project is accepting funding on either their GitHub or NPM page                                               | Medium     |
| [License type](#license-type)                                     | Describes how reliant the project is on funding by using the license of the project                                        | Medium-low |
| [Transparency on current financial sustainability](#transparency-on-current-financial-sustainability) | Indicates if the project has set any funding goals                                                                         | Low        |

## Sustainability of core contributors/maintainers
Priority: `High`, as it directly impacts the financial health of the project.

The higher the score, the better the financial sustainability of the project.

Divides the total income of the project by the team size to get the average income of a core contributor/maintainer working for the project. This income is then compared with every contributor/maintainer's regional Senior Software Engineer salary. If no regional data is available for a contributor/maintainer, the average world-wide salary of a Senior Software Engineer will be used.

Data required to score this criterion:
- Yearly revenue: Retrieved from OpenCollective
- Total cost of core contributors/maintainers
  - Requires the data:
    - Team size: Retrieved from OpenCollective
    - Contributor/Maintainer location: Retrieved from GitHub
      - If not available, the average Senior Software Engineer salary will be used
    - Regional salary: Retrieved from both [PayScale](https://developers.payscale.com/) and [Glassdoor](https://www.glassdoor.com/developer/index.htm)

Score will be calculated by dividing the total costs of core contributors/maintainers by the yearly revenue: costs / yearly revenue.

## Organisational activity
Priority: `High`, as it directly relates with the financial sustainability of a project because it indicates how much of the project relies on funding.

The higher the organisational activity, the less contributors/maintainers are dependent on funding, the better the financial health of the project.

Determines how many percent of total contributions made to the project are from contributors who are part of an organisation.

Data required to score this criterion:
- Top 100 contributor's account data: Retrieved from GitHub

The score is calculated by the percentage of the organisational activity inside the project.

## Acceptance of funding
Priority: `Medium`, as it does not directly impact the financial health of a repository but is a step to improve or sustain the financial health of a project.

The higher the score, the better the future of the financial health of the Open-Source project.

Indicates if the project is accepting funding on their GitHub or NPM page.

Checklist to score this criterion:
- Check if the project is promoting themselves on NPM
- Check if the project is promoting themselves on their GitHub page

This criterion's score is either 100 or 0 points. If a project is accepting funding in any way and have it on their NPM or GitHub page, they will receive 100 points, if not, 0 points.

## License type
Priority: `Medium-low`, as it does not directly impact the financial health but shows the dependence on funding.

The higher the score, the less dependent the project is on funding, the better it makes the financial health of the project.

Describes how reliant the project is on funding by using the license of the Open-Source project.

Data required to score this criterion:
- Project license: Retrieved from NPM or GitHub

Licenses are divided into three categories:
- Pay to use license: Seen as completely independent on funding
- Non-commercial use license: Seen as partly dependent on funding
- Free to use license: Seen as completely dependent on funding

The score is calculated by giving the license the following scores:
| License Type | Score |
| ------------ | ----- |
| Pay to use license | 100 |
| Non-commercial use license | 50 |
| Free to use license | 0 |

## Transparency on current financial sustainability
Priority: `Low`, as it does not directly impact the financial health of the project. It is just a method to trigger funders to fund the project.

The higher the score, the better the future of the financial health.

Describes if a project has defined a goal on funding. This will help funders with knowing if the project is doing good financially and may trigger them to fund the project when not.

Checklist to score this criterion:
- Check if the project has defined funding goals on their OpenCollective page.

This criterion's score is either a 100 or 0 points. If a project has defined their funding goals, the project will receive 100 points for this criterion, if not, it will receive 0 points.