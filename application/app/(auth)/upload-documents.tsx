import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lawyerApi } from '../../services/api';
import { CheckCircle, Upload, FileText, Lock } from 'lucide-react-native';
import clsx from 'clsx';
import { Image } from 'expo-image';

export default function UploadDocumentsScreen() {
    const router = useRouter();
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [documents, setDocuments] = useState<{ barCouncil: string | null; govtId: string | null }>({
        barCouncil: null,
        govtId: null,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleMockUpload = async (type: 'barCouncil' | 'govtId') => {
        setUploading({ ...uploading, [type]: true });

        // Simulating upload delay
        setTimeout(() => {
            setDocuments(prev => ({
                ...prev,
                [type]: type === 'barCouncil'
                    ? 'https://example.com/bar-council-id.pdf'
                    : 'https://example.com/govt-id.jpg'
            }));
            setUploading(prev => ({ ...prev, [type]: false }));
            Alert.alert('Upload Successful', `${type === 'barCouncil' ? 'Bar Council ID' : 'Government ID'} uploaded successfully.`);
        }, 1500);
    };

    const handleSubmit = async () => {
        if (!documents.barCouncil || !documents.govtId) {
            Alert.alert('Incomplete', 'Please upload both documents to proceed.');
            return;
        }

        setSubmitting(true);
        try {
            await lawyerApi.uploadDocuments({
                barCouncilDocUrl: documents.barCouncil,
                govtIdDocUrl: documents.govtId,
            });

            router.replace('/(auth)/verification-pending');
        } catch (error: any) {
            console.log('Upload Submission Error', error);
            Alert.alert('Submission Failed', 'Could not submit documents. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View className="items-center mb-8">
                    <View className="h-16 w-16 bg-primary-100 rounded-full items-center justify-center mb-4">
                        <Lock size={32} color="#0F172A" />
                    </View>
                    <Text className="text-2xl font-bold text-primary-900 text-center">Verify Identity</Text>
                    <Text className="text-gray-500 mt-2 text-center">
                        To maintain trust and quality, we require verify every lawyer on our platform.
                    </Text>
                </View>

                <View className="gap-y-6">
                    {/* Bar Council ID Upload */}
                    <View className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <View className="flex-row items-center mb-4">
                            <FileText size={24} color="#475569" />
                            <Text className="text-lg font-bold text-gray-800 ml-3">Bar Council ID</Text>
                        </View>
                        <Text className="text-gray-500 mb-4 text-sm">Upload a clear photo or scan of your Bar Council Identity Card.</Text>

                        {documents.barCouncil ? (
                            <View className="bg-green-100 p-4 rounded-lg flex-row items-center justify-center border border-green-200">
                                <CheckCircle size={20} color="#15803D" />
                                <Text className="text-green-800 font-medium ml-2">Document Uploaded</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => handleMockUpload('barCouncil')}
                                disabled={uploading['barCouncil']}
                                className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center active:bg-gray-50"
                            >
                                {uploading['barCouncil'] ? (
                                    <ActivityIndicator color="#0F172A" />
                                ) : (
                                    <>
                                        <Upload size={24} color="#64748B" />
                                        <Text className="text-primary-900 font-medium mt-2">Tap to Upload</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Government ID Upload */}
                    <View className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <View className="flex-row items-center mb-4">
                            <FileText size={24} color="#475569" />
                            <Text className="text-lg font-bold text-gray-800 ml-3">Government ID</Text>
                        </View>
                        <Text className="text-gray-500 mb-4 text-sm">Upload Aadhaar, PAN, or Passport for identity verification.</Text>

                        {documents.govtId ? (
                            <View className="bg-green-100 p-4 rounded-lg flex-row items-center justify-center border border-green-200">
                                <CheckCircle size={20} color="#15803D" />
                                <Text className="text-green-800 font-medium ml-2">Document Uploaded</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => handleMockUpload('govtId')}
                                disabled={uploading['govtId']}
                                className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center active:bg-gray-50"
                            >
                                {uploading['govtId'] ? (
                                    <ActivityIndicator color="#0F172A" />
                                ) : (
                                    <>
                                        <Upload size={24} color="#64748B" />
                                        <Text className="text-primary-900 font-medium mt-2">Tap to Upload</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting || !documents.barCouncil || !documents.govtId}
                    className={clsx(
                        "w-full py-4 rounded-xl items-center shadow-lg mt-8",
                        (submitting || !documents.barCouncil || !documents.govtId)
                            ? "bg-gray-300 shadow-none"
                            : "bg-primary-900 shadow-primary-900/20"
                    )}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Submit for Verification</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
