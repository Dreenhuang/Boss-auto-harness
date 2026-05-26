#!/bin/bash
# Boss-auto-harness v2.0 - Global Installation Script (Linux/macOS)
# Purpose: Install all Skills and configs to TRAE global directory
# After installation, all TRAE projects can directly use Boss mode features

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}========================================================${NC}"
echo -e "${CYAN}  Boss-auto-harness v2.0 Global Installer${NC}"
echo -e "${CYAN}  All TRAE projects can use Boss mode after installation${NC}"
echo -e "${CYAN}========================================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")"

# Detect TRAE installation directory
TRAEDIR="$HOME/.trae"
if [ ! -d "$TRAEDIR" ]; then
    if [ -d "$HOME/.trae-cn" ]; then
        TRAEDIR="$HOME/.trae-cn"
        echo -e "${GREEN}[OK]${NC} Detected TRAE config directory: $TRAEDIR"
    else
        echo -e "${YELLOW}[WARN]${NC} No TRAE config directory found, will create: $TRAEDIR"
    fi
else
    echo -e "${GREEN}[OK]${NC} Detected TRAE config directory: $TRAEDIR"
fi

# Create required directory structure
SKILLSDIR="$TRAEDIR/skills"
AGENTSDIR="$TRAEDIR/agents"
RULESDIR="$TRAEDIR/rules"

echo -e "${CYAN}[INFO]${NC} Creating directory structure..."
mkdir -p "$TRAEDIR" "$SKILLSDIR" "$AGENTSDIR" "$RULESDIR"
echo -e "${GREEN}[OK]${NC} Directory structure created"

# Copy Skills
echo -e "${CYAN}[INFO]${NC} Copying Skills to global directory..."
SOURCE_SKILLS="$SOURCE_DIR/skills"
if [ -d "$SOURCE_SKILLS" ]; then
    for skill_dir in "$SOURCE_SKILLS"/*/; do
        skill_name=$(basename "$skill_dir")
        rm -rf "$SKILLSDIR/$skill_name"
        cp -r "$skill_dir" "$SKILLSDIR/"
        echo -e "${GREEN}[OK]${NC}   Installed Skill: $skill_name"
    done
else
    echo -e "${RED}[ERROR]${NC} Skills directory not found: $SOURCE_SKILLS"
    exit 1
fi

# Copy Agents
echo -e "${CYAN}[INFO]${NC} Copying Agents to global directory..."
SOURCE_AGENTS="$SOURCE_DIR/trae-agents"
if [ -d "$SOURCE_AGENTS" ]; then
    for agent_file in "$SOURCE_AGENTS"/*.md; do
        [ -f "$agent_file" ] || continue
        cp "$agent_file" "$AGENTSDIR/"
        echo -e "${GREEN}[OK]${NC}   Installed Agent: $(basename "$agent_file")"
    done
fi

# Copy CLAUDE.md (main configuration)
echo -e "${CYAN}[INFO]${NC} Copying main configuration..."
if [ -f "$SOURCE_DIR/CLAUDE.md" ]; then
    cp "$SOURCE_DIR/CLAUDE.md" "$TRAEDIR/"
    echo -e "${GREEN}[OK]${NC}   Installed: CLAUDE.md"
fi

# Create global Rules file
echo -e "${CYAN}[INFO]${NC} Creating global trigger rules..."
cat > "$RULESDIR/boss-auto-harness.rules" << 'EOF'
# Boss-auto-harness Global Trigger Rules
# Version: 2.0.0
# Updated: 2026-04-30

## Trigger Keywords
When user input contains these keywords, automatically load Boss-auto-harness config:

### Primary Keywords
- "Boss" (capitalized)
- "boss" (lowercase)

### Chinese Keywords
- "boss模式"
- "boss moshi" (pinyin)
- "Boss-harness"
- "harness"
- "全自动开发"

### Shortcut Commands
- "/boss" - Quick activation
- "/harness" - Harness mode
- "/pm" - Product manager mode

## Configuration File Locations
- Main config: ~/.trae/CLAUDE.md
- Skills: ~/.trae/skills/
- Agents: ~/.trae/agents/

## Version Info
- Config Version: 2.0.0
- Last Updated: 2026-04-30
EOF
echo -e "${GREEN}[OK]${NC}   Created: boss-auto-harness.rules"

# Create uninstall script
echo -e "${CYAN}[INFO]${NC} Creating uninstall script..."
cat > "$TRAEDIR/uninstall-boss-auto-harness.sh" << 'UNINSTALL_EOF'
#!/bin/bash
# Boss-auto-harness Global Uninstall Script (Linux/macOS)

TRAEDIR="$HOME/.trae"

echo -e "\033[1;33m⚠️  Boss-auto-harness Uninstaller\033[0m"
echo -e "Will remove the following global configurations:"
echo -e "  - Skills directory"
echo -e "  - Agents directory"
echo -e "  - CLAUDE.md (if exists)"
echo -e "  - Rules files"
echo ""

read -p "Confirm uninstall? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo -e "\033[0;36mUninstall cancelled\033[0m"
    exit 0
fi

# Remove directories
for dir in "$TRAEDIR/skills" "$TRAEDIR/agents" "$TRAEDIR/rules"; do
    if [ -d "$dir" ]; then
        rm -rf "$dir"
        echo -e "\033[0;32m✅ Removed: $dir\033[0m"
    fi
done

# Remove files
for file in "$TRAEDIR/CLAUDE.md" "$TRAEDIR/boss-auto-harness.rules"; do
    if [ -f "$file" ]; then
        rm -f "$file"
        echo -e "\033[0;32m✅ Removed: $file\033[0m"
    fi
done

echo ""
echo -e "\033[0;32m✅ Uninstall complete! Restart TRAE IDE to apply changes.\033[0m"
UNINSTALL_EOF
chmod +x "$TRAEDIR/uninstall-boss-auto-harness.sh"
echo -e "${GREEN}[OK]${NC}   Created uninstall script: $TRAEDIR/uninstall-boss-auto-harness.sh"

# Verify installation
echo ""
echo -e "${GREEN}========================================================${NC}"
echo -e "${GREEN}                    ✅ Installation Complete!             ${NC}"
echo -e "${GREEN}========================================================${NC}"
echo ""
echo -e "Installation locations:"
echo -e "  Skills: $SKILLSDIR"
echo -e "  Agents: $AGENTSDIR"
echo -e "  Config: $TRAEDIR"
echo ""
echo -e "Verify installation:"
echo -e "  1. Restart TRAE IDE"
echo -e "  2. Open any project"
echo -e "  3. Type 'Boss' or 'boss模式' to test"
echo ""
echo -e "Uninstall:"
echo -e "  bash $TRAEDIR/uninstall-boss-auto-harness.sh"
echo ""
