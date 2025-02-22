import { ExpoConfig, ConfigContext } from 'expo/config';

module.exports = ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: 'PubRanker',
        slug: 'pubranker',
        plugins: [
            ...(config.plugins || []),
            [
                '@rnmapbox/maps',
                {
                    RNMapboxMapsVersion: '11.8.0',
                    RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET,
                },
            ],
        ],
    };
};
