# Art Timecode Reader

React + Electron desktop application for receiving and displaying ArtNet timecode signals from professional lighting and video systems. This companion tool to art-timecode-gen monitors and displays timecode in live events and broadcast production environments.

## Key Features

- **ArtNet Protocol Reception**: Receives ArtNet timecode packets (OpCode 0x9700) on port 6454 (ArtNet standard protocol)
- **Multiple Frame Rate Support**: Displays 24, 25, 29.97, and 30 fps timecode with automatic frame rate detection
- **Real-time Display**: Visual timecode display showing hours:minutes:seconds:frames format from network sources
- **Source Identification**: Shows IP address of timecode source for network troubleshooting and monitoring
- **Professional Interface**: Material-UI with lighting industry-standard display and controls for production use
- **Cross-Platform**: macOS and Windows builds with code signing and notarization for professional deployment
- **Auto-Update**: Electron auto-updater for maintaining current versions in production environments
- **Network Monitoring**: Continuously listens for incoming ArtNet timecode from lighting consoles and media servers
- **Production Ready**: Designed for reliable operation in live event and broadcast production environments

## Architecture

Electron application with React frontend and Node.js UDP server designed for receiving and displaying ArtNet timecode packets in professional production environments.

## Professional Usage

Used as a companion to art-timecode-gen in live events, broadcast production, and theatrical productions to monitor and display ArtNet timecode signals from lighting consoles, media servers, and other professional equipment.

## Dependencies

- React
- Electron
- Material-UI
- electron-updater