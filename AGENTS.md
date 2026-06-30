<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git Commit Rules

All git commits in this repository must strictly adhere to the Conventional Commits 1.0.0 specification.

## Commit Message Format

Each commit message must consist of a header, optionally a body, and optionally a footer. The header has a special format that includes a type, a scope, and a description:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 1. Type
Must be one of the following:
- `feat`: A new feature for the user, not a new feature for builds or internal tools.
- `fix`: A bug fix for the user, not a fix to a build script.
- `docs`: Documentation-only changes.
- `style`: Formatting, semi-colons, white space, etc. No production code change.
- `refactor`: Refactoring production code, e.g. renaming a variable, extracting a function. No new features or bug fixes.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests. No production code change.
- `build`: Changes that affect the build system, package dependencies, or external tools (e.g. npm, webpack, vite, tsconfig).
- `ci`: Changes to CI/CD configuration files and scripts.
- `chore`: Other changes that don't modify src or test files.
- `revert`: Reverts a previous commit.

### 2. Scope (Optional)
A scope may be provided after a type. A scope must consist of a noun describing a section of the codebase surrounded by parenthesis, e.g., `feat(auth): add login page`.

### 3. Description
The description is a short summary of the code changes.
- Use the imperative, present tense: "change" not "changed" nor "changes".
- Do not capitalize the first letter.
- No dot (.) at the end.

### 4. Body (Optional)
The body should include the motivation for the change and contrast it with previous behavior.

### 5. Footer (Optional)
Any footer should contain information about Breaking Changes and deprecations, or reference GitHub issues/PRs closed by the commit (e.g., `Close #123`).
- Breaking changes must start with the words `BREAKING CHANGE:` followed by a space or two newlines.

## Enforcement
AI assistants and human developers must ensure that any commit generated or suggested conforms to this format. Do not use generic commits like "update files" or "fix".

---

## COMPONENT-DRIVER TESTING ARCHITECTURE RULE

Whenever you build, generate, or modify any component (whether it belongs to the core atomic design system in `src/components/ui/` or is a high-level composed feature component), each component must have its own dedicated directory (e.g., `src/components/ui/[ComponentName]/` or `src/components/[ComponentName]/`). In that directory, you must generate three co-located files:
1. The component file itself (`[ComponentName].tsx`).
2. A component driver file (`[ComponentName].driver.ts`) that completely abstracts all DOM querying, user interactions, and styling assertions (e.g., encapsulating Tailwind CSS class string checks).
3. A clean specification file (`[ComponentName].test.tsx`) that tests the component's functionality by interacting exclusively through its companion driver.

Guidelines:
- Each component must reside in its own folder named after the component.
- Components should be extracted to smaller components as much as possible to ensure maximum modularity and reusability.
- Test files must never query the DOM or assert CSS classes directly; they must interact solely through the driver. This ensures that future visual changes or Tailwind updates will never break our test suites.
- High-level feature components should leverage the drivers of the atomic UI components they compose to maintain complete isolation.

---

# CODE COMMENTING RULE

- You should never add comments to code. All code must be self-documenting and clear. Do not include any code comments (including inline, block, JS/TS comments) in any newly created or modified files. Unrelated pre-existing comments should be preserved.
