import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { PublisherGithub } from '@electron-forge/publisher-github';
import { VitePlugin } from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'ArtTimecode Reader',
    executableName: 'art-timecode-reader',
    appBundleId: 'com.wbm.arttimecodereader',
    appCopyright: 'WBM Tek',
    icon: './src/assets/icon',
    asar: true,
    osxSign: {
      identity: 'Developer ID Application: WBM Tek'
    },
    osxNotarize: {
      appleId: process.env.APPLEID,
      appleIdPassword: process.env.artTCgenIDPASS,
      teamId: process.env.APPLE_TEAM_ID
    },
    win32metadata: {
      CompanyName: 'WBM Tek',
      FileDescription: 'ArtNet Timecode Reader',
      ProductName: 'ArtTimecode Reader',
      InternalName: 'ArtTimecode Reader',
      OriginalFilename: 'art-timecode-reader.exe'
    }
  },
  rebuildConfig: {
    force: true,
  },
  makers: [
    new MakerSquirrel({
      name: 'art-timecode-reader',
      setupExe: 'ArtTimecode-Reader-Setup.exe',
      setupIcon: './src/assets/icon.ico',
      signWithParams: '/sha1 b281b2c2413406e54ac73f3f3b204121b4a66e64 /fd sha256 /tr http://timestamp.sectigo.com /td sha256'
    }),
    new MakerZIP({}, ['darwin']),
    new MakerDMG({
      name: 'ArtTimecode Reader',
      icon: './src/assets/icon.icns'
    }),
    new MakerDeb({
      options: {
        name: 'art-timecode-reader',
        productName: 'ArtTimecode Reader',
        genericName: 'ArtNet Timecode Reader',
        description: 'ArtNet Timecode Reader',
        categories: ['AudioVideo'],
        maintainer: 'WBM Tek',
        homepage: 'https://www.wbmtek.com'
      }
    }),
    new MakerRpm({
      options: {
        name: 'art-timecode-reader',
        productName: 'ArtTimecode Reader',
        genericName: 'ArtNet Timecode Reader',
        description: 'ArtNet Timecode Reader',
        categories: ['AudioVideo']
      }
    })
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'wbmmusic',
        name: 'art-timecode-reader'
      },
      prerelease: false,
      draft: true
    })
  ]
};

export default config;