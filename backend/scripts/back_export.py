#!/usr/bin/env python3
"""
Matt Freedom Fundraiser v2 - Clean Code Snapshot Generator
Creates a clean snapshot of the donation platform code for debugging and development
"""

import os
from pathlib import Path
from datetime import datetime

# Focus on donation platform directories
INCLUDE_DIRS = [
    "donations",     # Main donations app
    "profiles",      # Matt's profile and links
    "emails",        # Email handling and PDFs  
    "accounts",      # User authentication
    "django_project" # Settings and main config
]

# Include these file extensions
INCLUDE_EXTENSIONS = [
    ".py",           # Python code
    ".txt",          # Requirements
    ".yml", ".yaml", # Docker files
    ".toml",         # Fly.io config
    ".html",         # Templates
    ".css",          # Styles
    ".js",           # JavaScript
    ".json"          # Config files
]

# Essential root files for the donation platform
ROOT_FILES = [
    "requirements.txt",
    "requirements-dev.txt", 
    "Dockerfile",
    "Dockerfile.dev",
    "docker-compose.yml",
    "fly.toml",
    "manage.py",
    ".env.example"
]

# Skip these directories completely
EXCLUDE_DIRS = {
    "__pycache__", "migrations", "venv", "env", "node_modules",
    "media", "static", "staticfiles", "uploads", ".git",
    "dist", "build", ".pytest_cache", ".coverage",
    # Old AI project directories (since we gutted them)
    "faceswap", "imagegen", "chat"
}

# Skip these files
EXCLUDE_FILES = {
    ".env", ".env.local", ".env.production", "db.sqlite3",
    ".DS_Store", "thumbs.db", "desktop.ini",
    "test_", "tests.py", "conftest.py"
}

def should_exclude_file(filename):
    """Check if file should be excluded"""
    if filename in EXCLUDE_FILES:
        return True
    if any(filename.startswith(pattern) for pattern in EXCLUDE_FILES):
        return True
    if filename.endswith(('.jpg', '.jpeg', '.png', '.gif', '.log', '.pyc', '.pyo')):
        return True
    if filename.startswith('.') and len(filename) > 1:  # Hidden files except .env.example
        return True
    return False

def should_include_file(file_path, filename):
    """Check if file should be included"""
    if should_exclude_file(filename):
        return False
    return any(file_path.endswith(ext) for ext in INCLUDE_EXTENSIONS)

def get_file_category(file_path):
    """Categorize files for better organization"""
    if file_path.endswith(('.txt', '.yml', '.yaml', '.toml', '.env.example')):
        return 'config'
    elif file_path == 'manage.py':
        return 'config'
    elif file_path.endswith('.html'):
        return 'templates'
    elif file_path.endswith(('.css', '.js')):
        return 'assets'
    elif file_path.endswith('.json'):
        return 'data'
    else:
        return 'python'

def collect_files():
    """Collect all essential files for the donation platform"""
    collected = []
    
    print("🔍 Scanning donation platform directories...")
    
    # Collect from specific directories
    for base_dir in INCLUDE_DIRS:
        if not os.path.exists(base_dir):
            print(f"⚠️  Directory {base_dir} does not exist, skipping...")
            continue
            
        print(f"📁 Scanning {base_dir}/...")
        for root, dirs, files in os.walk(base_dir):
            # Filter out excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path)
                
                if should_include_file(full_path, file):
                    try:
                        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                        
                        # Skip empty files or files that are too large
                        if len(content.strip()) == 0:
                            print(f"⏭️  Skipping empty file: {rel_path}")
                            continue
                        if len(content) > 50000:  # Skip files over 50KB
                            print(f"⏭️  Skipping large file: {rel_path} ({len(content)} chars)")
                            continue
                            
                        collected.append((rel_path, content))
                        print(f"✅ Included: {rel_path}")
                    except Exception as e:
                        print(f"❌ Error reading {rel_path}: {e}")

    # Add essential root files
    print("📄 Adding root configuration files...")
    for file in ROOT_FILES:
        if os.path.exists(file):
            try:
                with open(file, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                collected.append((file, content))
                print(f"✅ Included: {file}")
            except Exception as e:
                print(f"❌ Error reading {file}: {e}")

    return collected

def write_snapshot(files):
    """Write the clean snapshot with better organization"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    os.makedirs("scripts", exist_ok=True)
    output_path = f"scripts/donation_platform_snapshot_{timestamp}.txt"
    
    # Organize files by category
    categorized = {
        'config': [],
        'python': [],
        'templates': [],
        'assets': [],
        'data': []
    }
    
    for path, code in files:
        category = get_file_category(path)
        categorized[category].append((path, code))
    
    with open(output_path, "w", encoding="utf-8") as out:
        out.write("# MATT FREEDOM FUNDRAISER V2 - CODE SNAPSHOT\n")
        out.write("# Generated for donation platform development and debugging\n")
        out.write(f"# Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        out.write(f"# Total files: {len(files)}\n")
        out.write("# Focus: Donation platform, emails, profiles, authentication\n\n")
        
        # Write each category
        categories = [
            ('config', 'CONFIGURATION FILES'),
            ('python', 'PYTHON CODE'),
            ('templates', 'HTML TEMPLATES'),
            ('data', 'DATA & CONFIG FILES'),
            ('assets', 'FRONTEND ASSETS')
        ]
        
        for cat_key, cat_title in categories:
            if categorized[cat_key]:
                out.write(f"\n# ==================== {cat_title} ====================\n\n")
                
                for path, code in categorized[cat_key]:
                    out.write(f"\n# ==== {path} ====\n\n")
                    if path.endswith('.py'):
                        out.write(f"```python\n{code}\n```\n")
                    elif path.endswith(('.yml', '.yaml')):
                        out.write(f"```yaml\n{code}\n```\n")
                    elif path.endswith('.html'):
                        out.write(f"```html\n{code}\n```\n")
                    elif path.endswith('.js'):
                        out.write(f"```javascript\n{code}\n```\n")
                    elif path.endswith('.css'):
                        out.write(f"```css\n{code}\n```\n")
                    elif path.endswith('.json'):
                        out.write(f"```json\n{code}\n```\n")
                    else:
                        out.write(f"```\n{code}\n```\n")
    
    return output_path

def print_summary(files, output_path):
    """Print a summary of what was included"""
    file_count_by_type = {}
    for path, _ in files:
        ext = os.path.splitext(path)[1] or 'config'
        file_count_by_type[ext] = file_count_by_type.get(ext, 0) + 1
    
    print(f"\n🎯 DONATION PLATFORM SNAPSHOT COMPLETE")
    print(f"📁 Output: {output_path}")
    print(f"📊 Total files: {len(files)}")
    print(f"\n📋 File breakdown:")
    for ext, count in sorted(file_count_by_type.items()):
        print(f"  • {ext}: {count} files")
    
    print(f"\n🚀 To use with Docker:")
    print(f"  docker-compose exec backend python {__file__}")
    print(f"  docker cp $(docker-compose ps -q backend):/app/{output_path} ./")

def main():
    print("🏗️  Matt Freedom Fundraiser v2 - Creating donation platform snapshot...")
    print("🎯 Focus: Django backend, donation processing, email system\n")
    
    # Check if we're in the right directory
    if not os.path.exists('manage.py'):
        print("❌ manage.py not found. Make sure you're in the Django project root.")
        print("💡 If using Docker: docker-compose exec backend python create_donation_platform_snapshot.py")
        return
    
    collected_files = collect_files()
    
    if not collected_files:
        print("⚠️  No files found! Check your directory structure.")
        return
    
    output_path = write_snapshot(collected_files)
    print_summary(collected_files, output_path)
    
    print(f"\n✅ Snapshot ready for debugging Matt's donation platform!")

if __name__ == "__main__":
    main()