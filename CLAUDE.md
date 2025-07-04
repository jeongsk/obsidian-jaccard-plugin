# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- **Install dependencies**: `npm install`
- **Development build (with watch mode)**: `npm run dev`
- **Production build**: `npm run build`
- **Version bump**: `npm version` (automatically updates manifest.json and versions.json)

## Architecture Overview

This is an Obsidian plugin that finds similar notes using the Jaccard similarity index. The plugin analyzes tags, links, and keywords to calculate similarity between notes.

### Core Components

1. **main.ts** - Plugin entry point that:
   - Initializes indexing and similarity services
   - Registers the similar notes view in the right sidebar
   - Sets up file watchers for automatic re-indexing
   - Handles commands (reindex, show similar notes)
   - Manages plugin lifecycle

2. **src/indexing.ts** - Handles note indexing:
   - Extracts tags from metadata cache
   - Extracts wiki-links from metadata cache
   - Extracts top 20 keywords using TF-IDF approach (excluding stop words)
   - Maintains an in-memory index (Map<string, NoteIndex>)
   - Updates index on file changes

3. **src/similarity.ts** - Calculates similarity scores:
   - Uses weighted Jaccard index (intersection/union)
   - Default weights: tags (50%), links (30%), keywords (20%)
   - Weights are normalized to ensure they sum to 1
   - Returns similarity score, common tags count, and common links count

4. **src/view.ts** - Renders the UI:
   - ItemView that displays in the right sidebar
   - Shows similar notes sorted by similarity score (highest first)
   - Displays percentage score, note title, and common tags/links
   - Clicking a note opens it in the main workspace

5. **src/settings.ts** - Plugin configuration:
   - Weight sliders for tags, links, and keywords (0-1 range)
   - Maximum display notes setting (default: 100)
   - Minimum similarity threshold (default: 0.1)
   - Settings changes trigger re-calculation

### Key Implementation Details

- The plugin uses Obsidian's MetadataCache for efficient tag/link extraction
- Keyword extraction filters out stop words and uses word frequency
- All indexing is done in-memory for performance
- The view automatically updates when switching between notes
- File modifications trigger automatic re-indexing of that specific file

## Using Gemini CLI for Large Codebase Analysis

When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

### File and Directory Inclusion Syntax

Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
gemini command:

#### Examples

**Single file analysis:**

```bash
gemini -p "@src/main.py Explain this file's purpose and structure"
```

**Multiple files:**

```bash
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"
```

**Entire directory:**

```bash
gemini -p "@src/ Summarize the architecture of this codebase"
```

**Multiple directories:**

```bash
gemini -p "@src/ @tests/ Analyze test coverage for the source code"
```

**Current directory and subdirectories:**

```bash
gemini -p "@./ Give me an overview of this entire project"

# Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"
```

**Implementation Verification Examples:**

Check if a feature is implemented:

```bash
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"
```

Verify authentication implementation:

```bash
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"
```

Check for specific patterns:

```bash
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"
```

Verify error handling:

```bash
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"
```

Check for rate limiting:

```bash
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"
```

Verify caching strategy:

```bash
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"
```

Check for specific security measures:

```bash
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"
```

Verify test coverage for features:

```bash
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"
```

### When to Use Gemini CLI

Use gemini -p when:

- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase

### Important Notes

- Paths in @ syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for --yolo flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results
