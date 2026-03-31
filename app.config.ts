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
                    RNMAPBOX_MAPS_DOWNLOAD_TOKEN:
                        process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN,
                },
            ],
            'react-native-compressor',
        ],
    };
};
