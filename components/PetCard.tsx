import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    age: string;
    location: string;
    city: string;
    image: string;
    vaccinated: boolean;
    neutered: boolean;
  };
  onPress: () => void;
}

export default function PetCard({ pet, onPress }: PetCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: pet.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed} • {pet.age}</Text>
        <Text style={styles.location}>📍 {pet.location}, {pet.city}</Text>
        <View style={styles.tags}>
          {pet.vaccinated && (
            <View style={styles.tagGreen}>
              <Text style={styles.tagTextGreen}>Vaccinated</Text>
            </View>
          )}
          {pet.neutered && (
            <View style={styles.tagBlue}>
              <Text style={styles.tagTextBlue}>Neutered</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  breed: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  location: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tagGreen: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagTextGreen: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  tagBlue: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagTextBlue: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
});