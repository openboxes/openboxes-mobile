#!/bin/bash

# Exit on error
set -e

# --- Argument: Project Name ---
PROJECT_NAME="$1"
if [ -z "${PROJECT_NAME}" ]; then
    echo "Error: No project name supplied."
    echo "Usage: ./scripts/apply_branding.sh <project_name>"
    exit 1
fi
echo "Applying branding for project: ${PROJECT_NAME}"

# --- Source and Destination Paths ---
# Assumes script is run from project root (e.g., via npm script)
BRANDING_ROOT_DIR="./branding"
PROJECT_BRANDING_DIR="${BRANDING_ROOT_DIR}/${PROJECT_NAME}" # Source for this project's assets

# Validate project branding directory
if [ ! -d "${PROJECT_BRANDING_DIR}" ]; then
    echo "Error: Branding directory not found: ${PROJECT_BRANDING_DIR}"
    exit 1
fi
echo "Using assets from: ${PROJECT_BRANDING_DIR}"

# Common destination paths
SHARED_APP_ASSETS_IMAGES_DIR="./src/assets/images"
ANDROID_NATIVE_RES_DIR="./android/app/src/main/res"

echo "Execution CWD: $(pwd)" # Should be project root
echo ""

# --- Read App Name from Project's settings.json ---
SETTINGS_FILE="${PROJECT_BRANDING_DIR}/settings.json"
GENERAL_APP_NAME=""

if [ -f "${SETTINGS_FILE}" ]; then
    if command -v jq &>/dev/null; then # Corrected space
        GENERAL_APP_NAME=$(jq -r '.app_name' "${SETTINGS_FILE}")
        if [ -z "${GENERAL_APP_NAME}" ] || [ "${GENERAL_APP_NAME}" == "null" ]; then
            echo "  'app_name' not found or empty in ${SETTINGS_FILE}."
            GENERAL_APP_NAME=""
        else
            echo "  App name for '${PROJECT_NAME}': '${GENERAL_APP_NAME}'"
        fi
    else
        echo "  Warning: 'jq' not found. Cannot read app name from ${SETTINGS_FILE}."
    fi
else
    echo "  Settings file not found: ${SETTINGS_FILE}. App name not set."
fi
echo ""

# --- Android Platform Processing ---
echo ""
echo ">>> Processing Android Assets for '${PROJECT_NAME}'..."
PLATFORM_DENSITIES=("mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")

# 1. Android Launcher Icons
echo "Processing Android Launcher Icons..."
for density in "${PLATFORM_DENSITIES[@]}"; do
    SOURCE_ICON_FILE="${PROJECT_BRANDING_DIR}/android/mipmap-${density}/ic_launcher.png"
    DEST_ICON_FILE="${ANDROID_NATIVE_RES_DIR}/mipmap-${density}/ic_launcher_foreground.png"

    if [ -f "${SOURCE_ICON_FILE}" ]; then
        mkdir -p "$(dirname "${DEST_ICON_FILE}")"
        cp "${SOURCE_ICON_FILE}" "${DEST_ICON_FILE}"
        echo "  Copied Android icon: ${density}"
    else
        echo "  Warning: Android icon not found for ${density} at ${SOURCE_ICON_FILE}"
    fi
done
echo "Android Launcher Icons processed."
echo ""

# 2. Android Splash Screen
echo "Processing Android Splash Screen..."
SOURCE_SPLASH_FILE="${PROJECT_BRANDING_DIR}/splash.png" # Generic splash from project branding

if [ -f "${SOURCE_SPLASH_FILE}" ]; then
    for density in "${PLATFORM_DENSITIES[@]}"; do
        DEST_SPLASH_FILE="${ANDROID_NATIVE_RES_DIR}/mipmap-${density}/logo_splash.png"
        mkdir -p "$(dirname "${DEST_SPLASH_FILE}")"
        cp "${SOURCE_SPLASH_FILE}" "${DEST_SPLASH_FILE}"
        echo "  Copied splash to Android mipmap-${density}"
    done
else
    echo "  Warning: Splash screen not found: ${SOURCE_SPLASH_FILE}"
fi
echo "Android Splash Screen processed."
echo ""

# 3. Android App Display Name
echo "Processing Android App Display Name..."
ANDROID_STRINGS_FILE="${ANDROID_NATIVE_RES_DIR}/values/strings.xml"

if [ -z "${GENERAL_APP_NAME}" ]; then
    echo "  App name not available. Skipping Android display name update."
elif [ ! -f "${ANDROID_STRINGS_FILE}" ]; then
    echo "  Warning: Android strings.xml not found: ${ANDROID_STRINGS_FILE}"
else
    echo "  Setting Android app_name to: '${GENERAL_APP_NAME}'"
    if command -v sed &>/dev/null; then # Corrected space
        echo "    Using 'sed'. Ensure app_name in settings.json is XML-escaped if needed."
        # Modified sed command for in-place edit without backup.
        # Note: `sed -i` without a suffix works for GNU sed.
        # For BSD sed (like on macOS), you might need `sed -i '' ...` if issues arise.
        if sed -i "s#\(<string name=\"app_name\">\)[^<]*\(</string>\)#\1${GENERAL_APP_NAME}\2#g" "${ANDROID_STRINGS_FILE}"; then
            echo "      Updated Android app_name via sed."
        else
            echo "      Error: sed command failed for Android strings.xml."
        fi
    elif command -v xmlstarlet &>/dev/null; then # Corrected space
        echo "    Using 'xmlstarlet'."
        if xmlstarlet ed -L -u "/resources/string[@name='app_name']" -v "${GENERAL_APP_NAME}" "${ANDROID_STRINGS_FILE}"; then
            echo "      Updated Android app_name via xmlstarlet."
        else
            echo "      Error: xmlstarlet command failed for Android strings.xml."
        fi
    else
        echo "    Error: Neither 'sed' nor 'xmlstarlet' found. Cannot update Android app name."
    fi
fi
echo "Android App Display Name processed."
echo ""
echo ">>> Android Asset Processing Complete."
echo ""

# --- Shared Asset Processing ---
echo ""
echo ">>> Processing Shared Assets for '${PROJECT_NAME}'..."

# Shared In-App Logo
echo "Processing Shared In-App Logo..."
SOURCE_SHARED_LOGO_FILE="${PROJECT_BRANDING_DIR}/logo.png" # Logo from project branding
DEST_SHARED_LOGO_FILE="${SHARED_APP_ASSETS_IMAGES_DIR}/logo.png"

if [ -f "${SOURCE_SHARED_LOGO_FILE}" ]; then
    mkdir -p "$(dirname "${DEST_SHARED_LOGO_FILE}")"
    cp "${SOURCE_SHARED_LOGO_FILE}" "${DEST_SHARED_LOGO_FILE}"
    echo "  Copied shared logo: ${SOURCE_SHARED_LOGO_FILE} -> ${DEST_SHARED_LOGO_FILE}"
else
    echo "  Warning: Shared logo not found: ${SOURCE_SHARED_LOGO_FILE}"
fi
echo "Shared In-App Logo processed."
echo ""
echo ">>> Shared Asset Processing Complete."
echo ""

echo "Branding application for project '${PROJECT_NAME}' finished successfully!"
