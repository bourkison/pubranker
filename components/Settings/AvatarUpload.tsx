import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/supabase';
import { PRIMARY_COLOR } from '@/constants';
import { decode } from 'base64-arraybuffer';

type AvatarUploadProps = {
    profilePhoto: string;
    setProfilePhoto: (profilePhoto: string) => void;
};

export default function AvatarUpload({
    profilePhoto,
    setProfilePhoto,
}: AvatarUploadProps) {
    const [newImage, setNewImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const image = useMemo<string>(() => {
        if (!newImage && !profilePhoto) {
            return '';
        }

        if (!newImage && profilePhoto) {
            return profilePhoto;
        }

        return `data:image/jpeg;base64,${newImage}`;
    }, [newImage, profilePhoto]);

    const selectImage = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            allowsMultipleSelection: false,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });

        if (result.canceled) {
            return;
        }

        if (!result.assets[0].base64) {
            return;
        }

        setNewImage(result.assets[0].base64);
    }, []);

    // TODO: Image compression.
    // TODO: RLS policies ensure we can only change photos in our own.
    const uploadImage = useCallback(async () => {
        setIsUploading(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsUploading(false);
            return;
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('users')
            .upload(
                `${userData.user.id}/profile_${new Date()
                    .getTime()
                    .toString()}.jpeg`,
                decode(newImage),
                {
                    contentType: 'image/jpeg',
                    upsert: true,
                },
            );

        if (uploadError) {
            console.error(' upload error', uploadError);
            setIsUploading(false);
            return;
        }

        const { error } = await supabase
            .from('users_public')
            .update({ profile_photo: uploadData.path })
            .eq('id', userData.user.id);

        if (error) {
            console.error(error);
            setIsUploading(false);
            return;
        }

        // Delete old image.
        const { error: deleteError } = await supabase.storage
            .from('users')
            .remove([profilePhoto]);

        if (deleteError) {
            console.error(deleteError);
        }

        setIsUploading(false);
        setNewImage('');
        setProfilePhoto(uploadData.path);
    }, [setProfilePhoto, newImage, profilePhoto]);

    return (
        <View style={styles.container}>
            <View style={styles.uploadContainer}>
                <Pressable onPress={selectImage}>
                    <UserAvatar
                        photo={image}
                        size={96}
                        getPublicUrl={newImage ? false : true}
                    />
                </Pressable>

                <View style={styles.textContainer}>
                    <Text style={styles.hintText}>
                        To upload an avatar, please click your avatar to the
                        left, allow access to your photos, and upload a photo.
                    </Text>

                    <Text style={styles.hintText}>
                        Note that all image uploads must fall in line with our
                        Terms of Use.
                    </Text>
                </View>
            </View>

            {newImage && (
                <View style={styles.uploadButtonContainer}>
                    <Pressable
                        style={styles.uploadButton}
                        disabled={isUploading}
                        onPress={uploadImage}>
                        {isUploading ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Text style={styles.uploadText}>Upload</Text>
                        )}
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    uploadContainer: {
        flexDirection: 'row',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    hintText: {
        flex: 1,
        fontSize: 12,
        marginLeft: 15,
    },
    uploadButtonContainer: {
        paddingHorizontal: 40,
    },
    uploadButton: {
        marginTop: 25,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 4,
        borderRadius: 15,
    },
    uploadText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 12,
    },
});
