#!/bin/bash
# This script patches the source URL in Boost-related .podspec files.
# It is designed to be run from the project root.

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running script to patch podspec files..."

# --- Detect sed version for portability (GNU vs BSD) ---
SED_INPLACE_CMD="sed -i"
# The --version flag is a GNU extension. On BSD sed (macOS), this command will fail.
if ! sed --version >/dev/null 2>&1; then
    # We're on BSD sed, which requires a suffix for the -i flag.
    # An empty string '' tells it to edit in-place without a backup file.
    SED_INPLACE_CMD="sed -i ''"
    echo "  (Info: Detected BSD-style sed)"
fi

# --- Find and patch the files ---
# The `find` command locates all .podspec files in node_modules.
# The `-exec` flag runs our portable sed command on the found files.
# The `+` at the end passes multiple filenames to a single sed command,
# which is more efficient than running it once per file.
echo "  Searching for .podspec files in node_modules to patch..."
find node_modules -type f -name '*.podspec' -exec \
    ${SED_INPLACE_CMD} 's|https://boostorg\.jfrog\.io/artifactory/main/|https://archives.boost.io/|g' {} +

echo "Podspec patching complete."
