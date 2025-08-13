"use client"

import { Markdown } from "../prompt-kit/markdown"

const sampleMarkdown = `
# Code Preview Demo

This demonstrates the new code preview functionality for HTML, SVG, and JSON code blocks.

## HTML Example

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            color: white;
            text-align: center;
        }
        .btn {
            background: #fff;
            color: #333;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
        }
        .btn:hover {
            background: #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Code Preview!</h1>
        <p>This is a sample HTML page rendered in the preview.</p>
        <button class="btn">Click Me</button>
        <button class="btn">Another Button</button>
    </div>
</body>
</html>
\`\`\`

## SVG Example

\`\`\`svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4ecdc4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="100" cy="100" r="80" fill="url(#gradient1)" />
  <circle cx="100" cy="100" r="60" fill="none" stroke="#fff" stroke-width="3" opacity="0.7" />
  <circle cx="100" cy="100" r="40" fill="none" stroke="#fff" stroke-width="2" opacity="0.5" />
  <circle cx="100" cy="100" r="20" fill="none" stroke="#fff" stroke-width="1" opacity="0.3" />
  
  <text x="100" y="105" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
    SVG
  </text>
</svg>
\`\`\`

## JSON Example

\`\`\`json
{
  "name": "Code Preview Feature",
  "version": "1.0.0",
  "description": "A component that allows previewing HTML, SVG, and JSON code blocks",
  "features": [
    "HTML rendering in iframe with sandbox",
    "SVG visualization with security sanitization",
    "JSON formatting with syntax validation",
    "Fullscreen mode for better viewing",
    "App color scheme integration"
  ],
  "supported_languages": ["html", "svg", "json"],
  "security": {
    "html_sanitization": true,
    "svg_script_removal": true,
    "iframe_sandbox": ["allow-scripts", "allow-same-origin", "allow-popups", "allow-forms"]
  },
  "ui_features": {
    "toggle_preview": true,
    "fullscreen_mode": true,
    "copy_code": true,
    "error_handling": true
  }
}
\`\`\`

## Regular Code Block (No Preview)

\`\`\`javascript
// This is a regular JavaScript code block
// It won't have a preview button since JS is not supported yet
function greet(name) {
    return \`Hello, \${name}! The code preview feature is working great.\`;
}

console.log(greet("Developer"));
\`\`\`
`

export function CodePreviewDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Markdown>{sampleMarkdown}</Markdown>
    </div>
  )
}