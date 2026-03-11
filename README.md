# HumanizerAI CLI

Detect and humanize AI-generated text from the command line. Bypass GPTZero, Turnitin, Originality.ai, and other AI detectors.

Built for developers and AI agents.

## Install

```bash
npm install -g humanizerai
```

## Setup

```bash
export HUMANIZERAI_API_KEY=hum_your_api_key
```

Get your API key at [humanizerai.com/dashboard](https://humanizerai.com/dashboard). Requires Pro or Business plan.

## Usage

### Detect AI (free, unlimited)

```bash
humanizerai detect -t "Text to check"
humanizerai detect -f essay.txt
cat draft.txt | humanizerai detect
```

### Humanize (1 credit = 1 word)

```bash
humanizerai humanize -t "AI text to rewrite"
humanizerai humanize -t "Text" -i aggressive
humanizerai humanize -f draft.txt -r > final.txt
```

Intensity options: `light`, `medium` (default), `aggressive`

### Check Credits

```bash
humanizerai credits
```

## For AI Agents

This CLI is designed for use by AI agents (Claude, Cursor, Codex, etc.). Short commands reduce token usage and context rot compared to raw API calls.

Install the Claude Code skill:

```bash
npx @anthropic-ai/claude-code /learn humanizerai
```

See [SKILL.md](./SKILL.md) for the full agent reference.

## Quick Reference

```bash
humanizerai detect -t "text"              # Check AI score (free)
humanizerai humanize -t "text"            # Humanize (medium)
humanizerai humanize -t "text" -i light   # Light touch
humanizerai humanize -t "text" -i aggressive  # Max bypass
humanizerai humanize -f file.txt -r       # File in, text out
humanizerai credits                       # Check balance
```

## Links

- [humanizerai.com](https://humanizerai.com)
- [API Docs](https://humanizerai.com/docs/api)
- [Agent Skills Directory](https://agentskill.sh)
