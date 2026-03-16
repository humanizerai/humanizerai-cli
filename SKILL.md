---
name: humanizerai
description: Humanizer AI CLI. Detect AI-generated text and humanize it to bypass GPTZero, Turnitin, Originality.ai, Copyleaks, ZeroGPT, and Winston AI. Rewrite AI content into natural human writing. Free unlimited AI detection with score 0-100. Three humanization intensities (light, medium, aggressive). Works with ChatGPT, Claude, Gemini, and all LLM output.
version: 1.0.1
user-invocable: false
allowed-tools: Bash(humanizerai:*)
homepage: https://humanizerai.com
metadata:
  openclaw:
    emoji: "✍️"
    requires:
      env:
        - HUMANIZERAI_API_KEY
        - HUMANIZERAI_API_URL
      bins:
        - humanizerai
    primaryEnv: HUMANIZERAI_API_KEY
    install:
      - kind: node
        package: humanizerai
        bins: [humanizerai]
---

# Humanizer AI CLI

AI text detection and humanization from the command line. Detect AI patterns and rewrite text to bypass GPTZero, Turnitin, Originality.ai, and other detectors.

## Install

```bash
npm install -g humanizerai
```

npm release: https://www.npmjs.com/package/humanizerai
official website: https://humanizerai.com
API docs: https://humanizerai.com/docs/api

---

## Core Workflow

The fundamental pattern for using HumanizerAI CLI:

1. **Check** - Verify credits and API key
2. **Detect** - Analyze text for AI patterns (free)
3. **Humanize** - Rewrite to bypass detectors (uses credits)
4. **Verify** - Re-detect to confirm improvement

```bash
# 1. Check credits
humanizerai credits

# 2. Detect AI patterns (free, unlimited)
humanizerai detect -t "Your text here"

# 3. Humanize if score is high
humanizerai humanize -t "Your text here" -i medium

# 4. Verify improvement
humanizerai detect -t "The humanized text"
```

---

## Essential Commands

### Setup

```bash
# Required environment variable
export HUMANIZERAI_API_KEY=hum_your_api_key

# Get your API key at https://humanizerai.com/dashboard
# Requires Pro or Business plan for API access
```

### AI Detection (free, no credits)

```bash
# Detect from inline text
humanizerai detect -t "Text to analyze"

# Detect from file
humanizerai detect -f essay.txt

# Pipe from stdin
echo "Text to check" | humanizerai detect
cat draft.txt | humanizerai detect
```

**Response:**
```json
{
  "score": 82,
  "metrics": {
    "perplexity": 96,
    "burstiness": 15,
    "readability": 23,
    "satPercent": 3,
    "simplicity": 35,
    "ngramScore": 8,
    "averageSentenceLength": 21
  },
  "verdict": "Highly likely AI-generated",
  "wordsProcessed": 82
}
```

**Score interpretation:**
- 0-20: Human-written
- 21-40: Likely human, minor AI patterns
- 41-60: Mixed signals
- 61-80: Likely AI-generated
- 81-100: Highly likely AI-generated

### Humanization (1 credit = 1 word)

```bash
# Humanize with default intensity (medium)
humanizerai humanize -t "Your AI-generated text"

# Choose intensity level
humanizerai humanize -t "Text" -i light
humanizerai humanize -t "Text" -i medium
humanizerai humanize -t "Text" -i aggressive

# Humanize from file
humanizerai humanize -f draft.txt

# Raw output (just the humanized text, for piping)
humanizerai humanize -t "Text" -r
humanizerai humanize -f draft.txt -r > final.txt

# Pipe from stdin
cat essay.txt | humanizerai humanize -r > humanized-essay.txt
```

**Response:**
```json
{
  "humanizedText": "The rewritten text appears here...",
  "score": {
    "before": 85,
    "after": 22
  },
  "wordsProcessed": 150,
  "credits": {
    "subscriptionRemaining": 49850,
    "topUpRemaining": 0,
    "totalRemaining": 49850
  }
}
```

**Intensity levels:**

| Level | What it does | Best for |
|-------|-------------|----------|
| `light` | Subtle word changes, preserves style | Already-edited text, low AI scores |
| `medium` | Balanced rewriting (default) | Most use cases |
| `aggressive` | Maximum rewriting for bypass | High AI scores, strict detectors (Turnitin, GPTZero) |

### Credit Check

```bash
humanizerai credits
```

**Response:**
```json
{
  "credits": {
    "subscription": 50000,
    "topUp": 0,
    "total": 50000
  },
  "plan": "pro",
  "billingCycleEnd": "2026-04-01T00:00:00.000Z"
}
```

---

## Common Patterns

### Pattern 1: Detect, Humanize, Verify

The standard workflow for ensuring text passes AI detectors:

```bash
#!/bin/bash

# Step 1: Check current AI score
SCORE=$(humanizerai detect -t "Your text" | jq '.score')
echo "Current AI score: $SCORE"

# Step 2: If score > 40, humanize it
if [ "$SCORE" -gt 40 ]; then
  RESULT=$(humanizerai humanize -t "Your text" -i medium)
  HUMANIZED=$(echo "$RESULT" | jq -r '.humanizedText')
  echo "Humanized. Score: $(echo "$RESULT" | jq '.score.before') -> $(echo "$RESULT" | jq '.score.after')"

  # Step 3: Verify the result
  NEW_SCORE=$(humanizerai detect -t "$HUMANIZED" | jq '.score')
  echo "Verified score: $NEW_SCORE"
fi
```

### Pattern 2: Batch Humanize Multiple Files

```bash
#!/bin/bash

for file in drafts/*.txt; do
  echo "Processing: $file"
  humanizerai humanize -f "$file" -r > "humanized/$(basename "$file")"
  echo "Done: $file"
done
```

### Pattern 3: Content Pipeline (Generate, Humanize, Post)

Use with other agent tools for a full content automation pipeline:

```bash
#!/bin/bash

# 1. Generate content (from any AI)
DRAFT="Your AI-generated content here..."

# 2. Check if it needs humanizing
SCORE=$(echo "$DRAFT" | humanizerai detect | jq '.score')

if [ "$SCORE" -gt 40 ]; then
  # 3. Humanize it
  FINAL=$(echo "$DRAFT" | humanizerai humanize -i medium -r)
else
  FINAL="$DRAFT"
fi

# 4. Use the content (post to social media, save to file, etc.)
echo "$FINAL"
```

### Pattern 4: Escalating Intensity

Start with light touch, escalate only if needed:

```bash
#!/bin/bash

TEXT="Your AI text here"

for INTENSITY in light medium aggressive; do
  RESULT=$(humanizerai humanize -t "$TEXT" -i "$INTENSITY")
  AFTER=$(echo "$RESULT" | jq '.score.after')

  if [ "$AFTER" -lt 30 ]; then
    echo "Success with $INTENSITY intensity (score: $AFTER)"
    echo "$RESULT" | jq -r '.humanizedText'
    break
  fi

  echo "$INTENSITY: score $AFTER (too high, escalating...)"
  TEXT=$(echo "$RESULT" | jq -r '.humanizedText')
done
```

### Pattern 5: Check Credits Before Large Jobs

```bash
#!/bin/bash

# Count words in all files
TOTAL_WORDS=0
for file in drafts/*.txt; do
  WORDS=$(wc -w < "$file")
  TOTAL_WORDS=$((TOTAL_WORDS + WORDS))
done

# Check available credits
CREDITS=$(humanizerai credits | jq '.credits.total')

echo "Words to process: $TOTAL_WORDS"
echo "Credits available: $CREDITS"

if [ "$TOTAL_WORDS" -gt "$CREDITS" ]; then
  echo "Not enough credits. Top up at https://humanizerai.com/dashboard"
  exit 1
fi
```

---

## Supported AI Detectors

HumanizerAI is tested against and optimized to bypass:

- **GPTZero** (most common academic detector)
- **Turnitin** (university standard)
- **Originality.ai** (content marketing standard)
- **Copyleaks** (enterprise)
- **ZeroGPT** (free detector)
- **Winston AI** (publishing)

---

## Pricing & Plans

| Plan | Price | Words/Month | API Access |
|------|-------|-------------|-----------|
| Free | $0 | 0 | No |
| Starter | $9.99/mo | 10,000 | No |
| Pro | $19.99/mo | 50,000 | Yes (CLI + API) |
| Business | $49.99/mo | 200,000 | Yes (CLI + API) |

**Detection is always free and unlimited.** Only humanization uses credits.

Top up at: https://humanizerai.com/dashboard

---

## Common Gotchas

1. **API key not set** - Always `export HUMANIZERAI_API_KEY=hum_your_key` before using CLI
2. **No API access on free/starter** - CLI requires Pro or Business plan
3. **Detection score format** - The main score is the top-level `score` field (0-100), not nested
4. **Credits are per-word** - A 500-word essay uses 500 credits to humanize
5. **Detection is free** - Never costs credits, run it as many times as needed
6. **Intensity matters** - Start with `medium`. Only use `aggressive` for high scores (70+) or strict detectors
7. **Raw mode for piping** - Use `-r` flag to get just the text output without JSON wrapper
8. **File encoding** - Input files must be UTF-8 encoded text
9. **Max text length** - 10,000 words per request. Split longer documents.
10. **Re-detect after humanizing** - Always verify the score improved. Occasionally a second pass is needed.

---

## Quick Reference

```bash
# Environment
export HUMANIZERAI_API_KEY=hum_your_key

# Detection (free)
humanizerai detect -t "text"          # Inline text
humanizerai detect -f file.txt        # From file
cat file.txt | humanizerai detect     # From stdin

# Humanization (1 credit = 1 word)
humanizerai humanize -t "text"                  # Medium intensity
humanizerai humanize -t "text" -i light         # Light touch
humanizerai humanize -t "text" -i aggressive    # Max bypass
humanizerai humanize -f file.txt                # From file
humanizerai humanize -f file.txt -r > out.txt   # Raw output to file
cat file.txt | humanizerai humanize -r          # Pipe in, text out

# Account
humanizerai credits                   # Check balance

# Help
humanizerai --help                    # Show help
humanizerai detect --help             # Command help
```

---

## Discover More Skills

Find more AI agent skills at **https://agentskill.sh** including tools for content generation, social media posting, SEO optimization, and more.
