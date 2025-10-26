import os

# Auto-detect if we're in frontend directory or project root
def detect_directories():
    """Auto-detect the correct directories based on current location"""
    current_dir = os.getcwd()
    
    # Check if we're in the frontend directory
    if os.path.basename(current_dir) == "frontend" and os.path.exists("src"):
        print("📍 Detected: Running from frontend directory")
        return ["src", "public", "."], "scripts/frontend_code_snapshot.txt"
    
    # Check if we're in project root and frontend exists
    elif os.path.exists("frontend"):
        print("📍 Detected: Running from project root")
        return ["frontend/src", "frontend/public", "frontend"], "scripts/frontend_code_snapshot.txt"
    
    # Check if we're in project root but no frontend directory
    elif os.path.exists("backend"):
        print("📍 Detected: Project root, but no frontend directory yet")
        return [], "scripts/frontend_code_snapshot.txt"
    
    else:
        print("❌ Could not detect project structure")
        return [], "frontend_code_snapshot.txt"

# 🔥 FIXED: Only include TEXT-based file extensions
INCLUDE_EXTENSIONS = [
    ".ts", ".tsx", ".js", ".jsx", ".json", ".html", ".css", ".scss", 
    ".md", ".txt", ".yaml", ".yml", ".toml", 
    ".env.template", ".env.example", ".gitignore"
]

# 🔥 FIXED: Added binary extensions to EXCLUDE (don't read as text)
EXCLUDE_BINARY_EXTENSIONS = [
    ".ico", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", 
    ".woff", ".woff2", ".ttf", ".eot", ".pdf", ".zip", ".tar", ".gz"
]

# Directories to exclude
EXCLUDE_DIRS = {
    "node_modules", "dist", "build", ".next", ".vite", "coverage",
    "__pycache__", ".git", ".vscode", ".idea", "tmp", "temp"
}

# Files to exclude (but allow .env.template and .env.example)
EXCLUDE_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", ".DS_Store",
    "Thumbs.db", ".env.local", ".env.development", ".env.production", ".env"
}

# Important root files to always include
IMPORTANT_ROOT_FILES = [
    "package.json", "vite.config.ts", "vite.config.js", "tailwind.config.js", "postcss.config.js",
    "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", 
    "eslint.config.js", "index.html", "README.md",
    "netlify.toml", "Dockerfile", "Dockerfile.dev", ".env.template", ".env.example"
]

# Important React/src files to always include (relative to src directory)
IMPORTANT_SRC_FILES = [
    "App.tsx", "App.jsx", "main.tsx", "main.jsx", "index.tsx", "index.jsx",
    "App.css", "index.css", "main.css", "globals.css",
    "vite-env.d.ts", "env.d.ts"
]

def is_binary_file(file_path):
    """Check if file is binary based on extension"""
    return any(file_path.lower().endswith(ext) for ext in EXCLUDE_BINARY_EXTENSIONS)

def should_include_file(file_path, filename):
    """Check if file should be included based on extension and exclusion rules"""
    # 🔥 FIXED: Exclude binary files first
    if is_binary_file(file_path):
        return False
        
    if filename in EXCLUDE_FILES:
        return False
    
    # Always include important root files (if they're text-based)
    if filename in IMPORTANT_ROOT_FILES:
        return True
        
    # Always include important src files
    if filename in IMPORTANT_SRC_FILES:
        return True
        
    return any(file_path.endswith(ext) for ext in INCLUDE_EXTENSIONS)

def get_file_size_mb(file_path):
    """Get file size in MB"""
    try:
        size_bytes = os.path.getsize(file_path)
        return size_bytes / (1024 * 1024)
    except:
        return 0

def walk_and_collect(include_dirs):
    """Walk through frontend directories and collect relevant files"""
    collected = []
    found_important_src_files = []
    skipped_binary_files = []
    large_files_skipped = []

    for base_dir in include_dirs:
        if not os.path.exists(base_dir):
            print(f"⚠️  Directory {base_dir} does not exist, skipping...")
            continue
            
        print(f"🔍 Scanning directory: {base_dir}")
        
        # Handle root-level frontend files
        if base_dir in [".", "frontend"]:
            for file in os.listdir(base_dir):
                file_path = os.path.join(base_dir, file)
                if os.path.isfile(file_path):
                    # 🔥 FIXED: Check for binary files and skip them
                    if is_binary_file(file_path):
                        skipped_binary_files.append(file)
                        print(f"  🚫 Skipped binary file: {file}")
                        continue
                        
                    # 🔥 FIXED: Check file size (skip huge files)
                    file_size_mb = get_file_size_mb(file_path)
                    if file_size_mb > 1:  # Skip files larger than 1MB
                        large_files_skipped.append(f"{file} ({file_size_mb:.1f}MB)")
                        print(f"  🚫 Skipped large file: {file} ({file_size_mb:.1f}MB)")
                        continue
                        
                    if should_include_file(file_path, file):
                        try:
                            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                                content = f.read()
                            collected.append((file_path, content))
                            print(f"  ✅ Found root file: {file}")
                        except Exception as e:
                            print(f"❌ Error reading {file_path}: {e}")
        else:
            # Handle subdirectories
            for root, dirs, files in os.walk(base_dir):
                # Filter out excluded directories
                dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
                
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path)
                    
                    # 🔥 FIXED: Skip binary files
                    if is_binary_file(full_path):
                        skipped_binary_files.append(rel_path)
                        continue
                    
                    # 🔥 FIXED: Skip large files
                    file_size_mb = get_file_size_mb(full_path)
                    if file_size_mb > 1:
                        large_files_skipped.append(f"{rel_path} ({file_size_mb:.1f}MB)")
                        continue
                    
                    # Track important src files
                    if file in IMPORTANT_SRC_FILES:
                        found_important_src_files.append(file)
                        print(f"  ✅ Found important src file: {file}")
                    
                    if should_include_file(full_path, file):
                        try:
                            with open(full_path, "r", encoding="utf-8", errors="replace") as f:
                                content = f.read()
                            collected.append((rel_path, content))
                            
                            # Extra logging for key React files
                            if file.endswith(('.tsx', '.jsx')) and 'App' in file:
                                print(f"  🎯 Captured React App file: {rel_path}")
                                
                        except Exception as e:
                            print(f"❌ Error reading {rel_path}: {e}")

    # Report on what was found/skipped
    print(f"\n📋 Important src files found: {len(found_important_src_files)}")
    for file in found_important_src_files:
        print(f"  ✅ {file}")
    
    if skipped_binary_files:
        print(f"\n🚫 Binary files skipped: {len(skipped_binary_files)}")
        for file in skipped_binary_files[:5]:  # Show first 5
            print(f"  🖼️  {file}")
        if len(skipped_binary_files) > 5:
            print(f"  ... and {len(skipped_binary_files) - 5} more")
    
    if large_files_skipped:
        print(f"\n🚫 Large files skipped: {len(large_files_skipped)}")
        for file in large_files_skipped:
            print(f"  📦 {file}")
    
    missing_src_files = set(IMPORTANT_SRC_FILES) - set(found_important_src_files)
    if missing_src_files:
        print(f"\n⚠️  Missing important src files:")
        for file in missing_src_files:
            print(f"  ❌ {file}")

    return collected

def write_snapshot(files, output_path):
    """Write collected files to snapshot file"""
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 🔥 FIXED: Calculate total size
    total_chars = sum(len(content) for _, content in files)
    total_lines = sum(content.count('\n') for _, content in files)
    
    with open(output_path, "w", encoding="utf-8") as out:
        out.write("# FRONTEND CODE SNAPSHOT\n")
        out.write("# Generated for React/TypeScript project\n")
        out.write(f"# Total files: {len(files)}\n")
        out.write(f"# Total lines: {total_lines:,}\n")
        out.write(f"# Total characters: {total_chars:,}\n\n")
        
        # Group files by type for better organization
        config_files = []
        react_main_files = []
        component_files = []
        service_files = []
        type_files = []
        style_files = []
        other_files = []
        
        for path, code in files:
            filename = os.path.basename(path)
            
            # Configuration files (root level)
            if any(path.endswith(ext) for ext in ['.json', '.js', '.ts', '.toml', '.yml', '.yaml']) and not '/src/' in path:
                config_files.append((path, code))
            # Main React files (App.tsx, main.tsx, etc.)
            elif filename in IMPORTANT_SRC_FILES and filename.endswith(('.tsx', '.jsx', '.ts', '.js')):
                react_main_files.append((path, code))
            # Component files
            elif '/components/' in path or '/component/' in path:
                component_files.append((path, code))
            # Service files  
            elif '/services/' in path or '/service/' in path or '/api/' in path:
                service_files.append((path, code))
            # Type files
            elif '/types/' in path or '/type/' in path or filename.endswith('.d.ts'):
                type_files.append((path, code))
            # Style files
            elif any(path.endswith(ext) for ext in ['.css', '.scss', '.sass']):
                style_files.append((path, code))
            else:
                other_files.append((path, code))
        
        # Write in organized sections
        sections = [
            ("Configuration Files", config_files),
            ("Type Definitions", type_files),
            ("Services & API", service_files),
            ("Main React Files", react_main_files),
            ("React Components", component_files),
            ("Styles", style_files),
            ("Other Files", other_files)
        ]
        
        for section_name, section_files in sections:
            if section_files:
                out.write(f"\n\n# ==================== {section_name} ====================\n\n")
                for path, code in section_files:
                    out.write(f"\n\n# ==== {path} ====\n\n")
                    out.write(code)

def main():
    """Main execution function"""
    print("🚀 Starting FIXED frontend code snapshot generation...")
    print("🔥 This version excludes binary files and large files")
    
    # Auto-detect directories
    include_dirs, output_path = detect_directories()
    
    if not include_dirs:
        print("⚠️  No frontend structure detected!")
        print("🔧 To set up frontend, run from project root:")
        print("   npm create vite@latest frontend -- --template react-ts")
        return
    
    print(f"📁 Output file: {output_path}")
    
    collected_files = walk_and_collect(include_dirs)
    
    if not collected_files:
        print("⚠️  No frontend files found!")
        return
    
    write_snapshot(collected_files, output_path)
    
    print(f"✅ Frontend snapshot created: {output_path}")
    print(f"📊 Files included: {len(collected_files)}")
    
    # Print detailed summary
    file_types = {}
    important_files_found = []
    react_files_found = []
    
    total_lines = 0
    total_chars = 0
    
    for path, content in collected_files:
        filename = os.path.basename(path)
        ext = os.path.splitext(path)[1] or "no extension"
        file_types[ext] = file_types.get(ext, 0) + 1
        
        total_lines += content.count('\n')
        total_chars += len(content)
        
        if filename in IMPORTANT_ROOT_FILES:
            important_files_found.append(filename)
        
        if filename.endswith(('.tsx', '.jsx')):
            react_files_found.append(filename)
    
    print(f"\n📊 Snapshot stats:")
    print(f"  • Total lines: {total_lines:,}")
    print(f"  • Total characters: {total_chars:,}")
    print(f"  • File size: ~{total_chars / 1024:.1f}KB")
    
    print("\n📋 File types included:")
    for ext, count in sorted(file_types.items()):
        print(f"  • {ext}: {count} files")
    
    print(f"\n🎯 Important config files found: {len(important_files_found)}")
    for file in sorted(important_files_found):
        print(f"  ✅ {file}")
    
    print(f"\n⚛️  React files found: {len(react_files_found)}")
    for file in sorted(react_files_found):
        print(f"  ✅ {file}")
    
    # Check for missing important files
    missing_files = set(IMPORTANT_ROOT_FILES) - set(important_files_found)
    if missing_files:
        print(f"\n⚠️  Missing important config files:")
        for file in sorted(missing_files):
            print(f"  ❌ {file}")
    
    # Specifically check for App.tsx
    app_files = [f for f in react_files_found if 'App' in f]
    if app_files:
        print(f"\n🎯 App files found: {', '.join(app_files)}")
    else:
        print(f"\n⚠️  No App.tsx or App.jsx found!")
            
    print(f"\n🎉 Done! Clean text-only snapshot created.")
    print(f"💡 File size should be much smaller now (no binary data)")

if __name__ == "__main__":
    main()