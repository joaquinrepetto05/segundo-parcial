import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, SafeAreaView, TouchableOpacity, Modal, TextInput, Button, Platform, } from 'react-native';
import { useEffect, useState } from 'react';
import { getTeams, addTeam } from './api/apiServices';
import { Link } from 'expo-router';

export default function Home() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', logo: '', goals: '', points: '' });
  const [isSortedByPoints, setIsSortedByPoints] = useState(false);

  const fetchTeams = async () => {
    setLoading(true);
    const data = await getTeams();
    setTeams(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddPlanet = async () => {
    if (newTeam.name && newTeam.description && newTeam.logo) {
      const success = await addTeam(newTeam);
      if (success) {
        fetchTeams();
        setModalVisible(false);
        setNewTeam({ name: '', description: '', logo: '', goals: '', points: '' });
      } else {
        alert('Error al agregar el planeta.');
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const toggleSortOrder = () => {
    if (isSortedByPoints) {
      fetchTeams();
    } else {
      const sortedPlanets = [...teams].sort((a, b) => b.points - a.points);
      setTeams(sortedPlanets);
    }
    setIsSortedByPoints(!isSortedByPoints);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.pageTitle}>CONMEBOL - Oficial</Text>

      <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
        <Text style={styles.sortButtonText}>
          {isSortedByPoints ? 'Orden Original' : 'Ordenar por Puntos'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, platformStyles.addButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={platformStyles.addButtonText}>+ {Platform.OS === 'android' ? 'Nuevo Equipo' : 'Crear Equipo'}</Text>
      </TouchableOpacity>

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/details',
              params: { id: item.id },
            }}
            style={styles.card}
          >
            <Image source={{ uri: item.logo }} style={styles.teamImage} />
            <Text style={styles.teamName}>{item.name}</Text>
          </Link>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nuevo Equipo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del equipo"
              placeholderTextColor="#555"
              value={newTeam.name}
              onChangeText={(text) => setNewTeam({ ...newTeam, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#555"
              value={newTeam.description}
              onChangeText={(text) => setNewTeam({ ...newTeam, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de la imagen"
              placeholderTextColor="#555"
              value={newTeam.logo}
              onChangeText={(text) => setNewTeam({ ...newTeam, logo: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Goles"
              placeholderTextColor="#555"
              value={newTeam.goals}
              onChangeText={(text) => setNewTeam({ ...newTeam, goals: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Puntos"
              placeholderTextColor="#555"
              value={newTeam.points}
              onChangeText={(text) => setNewTeam({ ...newTeam, points: text })}
            />

            <View style={styles.modalButtons}>
              <Button title="Agregar" onPress={handleAddPlanet} />
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const platformStyles = StyleSheet.create({
  addButton: {
    alignSelf: Platform.OS === 'android' ? 'flex-start' : 'flex-end',
    backgroundColor: Platform.OS === 'android' ? 'blue' : 'green',
  },
  addButtonText: {
    color: Platform.OS === 'android' ? 'white' : 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  sortButton: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  flatListContainer: { paddingHorizontal: 5 },
  card: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '85%',
  },
  teamImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});