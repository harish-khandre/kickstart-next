# Goals

- [x] create front end for showing options
- [] create templates
- [] take user options and in the end install packages migrate the templates for starter kit

# TODO

1. Package Manager

   - [x] Get User Package Manager

2. Project Setup

   - [ ] Gather basic project details: name, ShadCN UI, and PayloadCMS preferences.
   - [ ] Create starter templates based on these preferences.

3. Backend Selection

   - [ ] Prompt user to choose backend tech (tRPC, GraphQL, REST API).
   - [ ] Select ORM (Prisma, Drizzle, or none).
   - [ ] Select database (MongoDB, PostgreSQL, MySQL, or none).
   - [ ] If database is selected, configure a local Docker setup.

4. Authentication

   - [ ] Prompt user to select an auth library (auth.js, Lucia, or none).
   - [ ] Gather provider selections (Google, Discord, Apple, GitHub).

5. Git Integration

   - [ ] Prompt for Git repository setup (yes/no).

6. Finalize
   - [ ] Install selected packages.
   - [ ] Migrate templates based on user input.
   - [ ] Complete initial project setup and run initial checks.

# Tech

1. package manager ? npm or bun or pnpm or yarn ?
2. Project name ?
3. shadcn ? Boolean
4. payloadcms ? Boolean
5. back end tech ? trpc or graphql or rest api ?
6. orm ? prisma or drizzle or none ?
7. database ? mongodb or postgres or mysql or none ? (depending on db create local db using docker)
8. authentication ? auth.js or lucia or none ? (if auth.js use github.com/harish-khandre/auth template)
9. providers ? multi select : 1. google 2. discord 3. apple 4. github
10. git ? boolean
11. sst?

# Questions

1. Should we mix kirimase and t3 stack like initiate with next.js project and then let the user how he wants his next.js repo and that goes for same commands like shadcn ... like give options with initializers like of next.js shadcn and all and where the manual setup is required we come and give them template but for that i have to consider what options did user selected in the initializers and based on that i have to curate the templates

# Extra

- [] Add SEO optimizations with google analytics functions from next-froge and techniques from next faster for performance optimizations
