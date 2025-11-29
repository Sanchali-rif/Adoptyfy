import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  image: string;
  status: 'available' | 'pending' | 'adopted';
}

interface AdoptionRequest {
  id: string;
  petName: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pets' | 'add' | 'requests'>('pets');

  const [myPets, setMyPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
      status: 'available',
    },
    {
      id: '2',
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      age: '1 year',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
      status: 'pending',
    },
  ]);

  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([
    {
      id: '1',
      petName: 'Buddy',
      adopterName: 'Rahul Sharma',
      adopterEmail: 'rahul@example.com',
      adopterPhone: '+91 98765 43210',
      status: 'pending',
      date: '2025-11-01',
    },
    {
      id: '2',
      petName: 'Luna',
      adopterName: 'Priya Patel',
      adopterEmail: 'priya@example.com',
      adopterPhone: '+91 98765 43211',
      status: 'pending',
      date: '2025-10-30',
    },
  ]);

  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    description: '',
  });

  const handleAddPet = () => {
    if (!newPet.name || !newPet.breed || !newPet.age) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const pet: Pet = {
      id: Date.now().toString(),
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed,
      age: newPet.age,
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
      status: 'available',
    };

    setMyPets([...myPets, pet]);
    setNewPet({ name: '', species: 'Dog', breed: '', age: '', description: '' });
    Alert.alert('Success', 'Pet added successfully!');
    setActiveTab('pets');
  };

  const handleRequestAction = (requestId: string, action: 'approved' | 'rejected') => {
    setAdoptionRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: action } : req
      )
    );
    Alert.alert('Success', `Request ${action}!`);
  };

  // My Pets Tab
  const MyPetsTab = () => (
    <FlatList
      data={myPets}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.petCard}>
          <Image source={{ uri: item.image }} style={styles.petImage} />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petBreed}>{item.breed} • {item.age}</Text>
            <View
              style={[
                styles.statusBadge,
                item.status === 'available' && styles.statusAvailable,
                item.status === 'pending' && styles.statusPending,
                item.status === 'adopted' && styles.statusAdopted,
              ]}
            >
              <Text style={styles.statusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No pets added yet</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setActiveTab('add')}
          >
            <Text style={styles.addButtonText}>Add Your First Pet</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );

  // Add Pet Tab
  const AddPetTab = () => (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.formTitle}>Add New Pet</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pet Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Buddy"
          value={newPet.name}
          onChangeText={(text) => setNewPet({ ...newPet, name: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Species *</Text>
        <View style={styles.speciesContainer}>
          <TouchableOpacity
            style={[
              styles.speciesButton,
              newPet.species === 'Dog' && styles.speciesButtonActive,
            ]}
            onPress={() => setNewPet({ ...newPet, species: 'Dog' })}
          >
            <Text
              style={[
                styles.speciesText,
                newPet.species === 'Dog' && styles.speciesTextActive,
              ]}
            >
              🐕 Dog
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.speciesButton,
              newPet.species === 'Cat' && styles.speciesButtonActive,
            ]}
            onPress={() => setNewPet({ ...newPet, species: 'Cat' })}
          >
            <Text
              style={[
                styles.speciesText,
                newPet.species === 'Cat' && styles.speciesTextActive,
              ]}
            >
              🐈 Cat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Breed *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Golden Retriever"
          value={newPet.breed}
          onChangeText={(text) => setNewPet({ ...newPet, breed: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2 years"
          value={newPet.age}
          onChangeText={(text) => setNewPet({ ...newPet, age: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell potential adopters about this pet..."
          multiline
          numberOfLines={4}
          value={newPet.description}
          onChangeText={(text) => setNewPet({ ...newPet, description: text })}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAddPet}>
        <Text style={styles.submitButtonText}>Add Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Requests Tab
  const RequestsTab = () => (
    <FlatList
      data={adoptionRequests}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestPetName}>{item.petName}</Text>
            <View
              style={[
                styles.requestStatusBadge,
                item.status === 'pending' && styles.requestStatusPending,
                item.status === 'approved' && styles.requestStatusApproved,
                item.status === 'rejected' && styles.requestStatusRejected,
              ]}
            >
              <Text style={styles.requestStatusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.requestAdopter}>{item.adopterName}</Text>
          <Text style={styles.requestContact}>📧 {item.adopterEmail}</Text>
          <Text style={styles.requestContact}>📱 {item.adopterPhone}</Text>
          <Text style={styles.requestDate}>Applied on {item.date}</Text>

          {item.status === 'pending' && (
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleRequestAction(item.id, 'approved')}
              >
                <Text style={styles.approveButtonText}>✓ Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRequestAction(item.id, 'rejected')}
              >
                <Text style={styles.rejectButtonText}>✗ Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No adoption requests yet</Text>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏠 Shelter Dashboard</Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pets' && styles.tabActive]}
          onPress={() => setActiveTab('pets')}
        >
          <Text
            style={[styles.tabText, activeTab === 'pets' && styles.tabTextActive]}
          >
            My Pets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'add' && styles.tabActive]}
          onPress={() => setActiveTab('add')}
        >
          <Text
            style={[styles.tabText, activeTab === 'add' && styles.tabTextActive]}
          >
            Add Pet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'requests' && styles.tabTextActive,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'pets' && <MyPetsTab />}
      {activeTab === 'add' && <AddPetTab />}
      {activeTab === 'requests' && <RequestsTab />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  logoutText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#7C3AED',
  },
  tabText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  petCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  petInfo: {
    flex: 1,
    marginLeft: 12,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusAvailable: {
    backgroundColor: '#D1FAE5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusAdopted: {
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 20,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
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
  speciesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  speciesButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  speciesButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  speciesText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  speciesTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestPetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  requestStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requestStatusPending: {
    backgroundColor: '#FEF3C7',
  },
  requestStatusApproved: {
    backgroundColor: '#D1FAE5',
  },
  requestStatusRejected: {
    backgroundColor: '#FEE2E2',
  },
  requestStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestAdopter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  requestContact: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  approveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});