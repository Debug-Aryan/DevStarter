# Deployment Guide

This app uses Expo EAS for builds and updates.

## Prerequisites
1.  Install EAS CLI: `npm install -g eas-cli`
2.  Login to Expo: `eas login`
3.  Configure project: `eas build:configure`

## Building
- **Android APK**: `eas build -p android --profile preview`
- **Android Bundle (AAB)**: `eas build -p android --profile production`
- **iOS Simulator**: `eas build -p ios --profile preview`
- **iOS App Store**: `eas build -p ios --profile production`

## Submitting
To submit to app stores:
```bash
eas submit -p android
eas submit -p ios
```
