import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { mockPets } from '../constants/mockData';

export default function AdoptionFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const pet = mockPets.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    livingSituation: 'own-house',
    reason: '',
    experience: '',
    agreedToTerms: false,
  });

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.agreedToTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    Alert.alert(
      'Success',
      'Application submitted successfully! The shelter will contact you soon.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/feed'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Adoption Application</Text>
          <Text style={styles.subtitle}>
            Complete this form to adopt {pet?.name}
          </Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData({ ...formData, fullName: text })
              }
            />
          </View>

          {/* Contact Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData({ ...formData, phone: text })
              }
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
            />
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Your complete address"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
            />
          </View>

          {/* Living Situation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Living Situation</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  formData.livingSituation === 'own-house' && styles.pickerOptionActive,
                ]}
                onPress={() =>
                  setFormData({ ...formData, livingSituation: 'own-house' })
                }
              >
                <Text
                  style={[
                    styles.pickerText,
                    formData.livingSituation === 'own-house' && styles.pickerTextActive,
                  ]}
                >
                  Own House
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  formData.livingSituation === 'rented-apartment' &&
                    styles.pickerOptionActive,
                ]}
                onPress={() =>
                  setFormData({
                    ...formData,
                    livingSituation: 'rented-apartment',
                  })
                }
              >
                <Text
                  style={[
                    styles.pickerText,
                    formData.livingSituation === 'rented-apartment' &&
                      styles.pickerTextActive,
                  ]}
                >
                  Rented Apartment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pickerOption,
                  formData.livingSituation === 'rented-house' &&
                    styles.pickerOptionActive,
                ]}
                onPress={() =>
                  setFormData({ ...formData, livingSituation: 'rented-house' })
                }
              >
                <Text
                  style={[
                    styles.pickerText,
                    formData.livingSituation === 'rented-house' &&
                      styles.pickerTextActive,
                  ]}
                >
                  Rented House
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reason for Adoption */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Why do you want to adopt {pet?.name}?
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your motivation and how you'll care for the pet..."
              multiline
              numberOfLines={4}
              value={formData.reason}
              onChangeText={(text) =>
                setFormData({ ...formData, reason: text })
              }
            />
          </View>

          {/* Previous Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Previous Pet Experience</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Have you owned pets before? Tell us about your experience..."
              multiline
              numberOfLines={3}
              value={formData.experience}
              onChangeText={(text) =>
                setFormData({ ...formData, experience: text })
              }
            />
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setFormData({
                ...formData,
                agreedToTerms: !formData.agreedToTerms,
              })
            }
          >
            <View
              style={[
                styles.checkbox,
                formData.agreedToTerms && styles.checkboxChecked,
              ]}
            >
              {formData.agreedToTerms && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the home verification and follow-up visits
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 16,
    color: '#7C3AED',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  pickerOptionActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  pickerText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pickerTextActive: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});