# Obsidian Jaccard Plugin

This plugin helps you discover similar notes in your Obsidian vault using the Jaccard similarity index. It analyzes tags, links, and keywords to find related content.

## Features

- **Automatic Similarity Detection**: Finds similar notes based on tags, links, and keywords
- **Customizable Weights**: Adjust the importance of tags, links, and keywords in similarity calculations
- **Live Updates**: Similarity list updates automatically when you switch between notes
- **Performance Optimized**: Uses efficient indexing for fast similarity calculations

## How it Works

The plugin uses the Jaccard similarity index to compare notes:
- **Tags** (50% weight by default): Compares hashtags between notes
- **Links** (30% weight by default): Compares wiki-links between notes  
- **Keywords** (20% weight by default): Extracts and compares important words

## Usage

1. Install and enable the plugin
2. A sidebar will appear showing similar notes to your current note
3. Click on any similar note to open it
4. Use the settings to customize weights and display options

## Commands

- **Show similar notes**: Opens the similar notes sidebar
- **Reindex all notes**: Manually rebuilds the similarity index

## Settings

- **Tag Weight**: Importance of tags in similarity calculation (0-1)
- **Link Weight**: Importance of links in similarity calculation (0-1)
- **Keyword Weight**: Importance of keywords in similarity calculation (0-1)
- **Maximum Display Notes**: Maximum number of similar notes to show
- **Minimum Similarity Threshold**: Minimum similarity score to display a note

## Installation

### From Obsidian Community Plugins (Coming Soon)
1. Open Settings > Community plugins
2. Search for "Jaccard Similar Notes"
3. Install and enable the plugin

### Method 1: Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/jeongsk/obsidian-jaccard-plugin/releases)
2. Extract the files (`main.js`, `manifest.json`, `styles.css`) to your vault's `.obsidian/plugins/obsidian-jaccard-plugin/` folder
3. Reload Obsidian
4. Enable the plugin in Settings > Community plugins

### Method 2: Using BRAT (Beta Reviewers Auto-update Tool)
1. Install the BRAT plugin from Community plugins
2. Open Command Palette (Cmd/Ctrl + P) and run `BRAT: Add a beta plugin for testing`
3. Enter this repository URL: `https://github.com/jeongsk/obsidian-jaccard-plugin`
4. Click "Add Plugin" and wait for installation
5. Go to Settings → Community plugins and enable "Jaccard Plugin"

## Support

If you encounter any issues or have feature requests, please file them on the [GitHub repository](https://github.com/jeongsk/obsidian-jaccard-plugin).

## License

MIT