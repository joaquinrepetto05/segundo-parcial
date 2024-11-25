import { StyleSheet, Text, View, Image, SafeAreaView, ActivityIndicator, Button, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getTeamById, deleteTeamById, updateTeam } from './api/apiServices';

export default function Details() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newDescription, setNewDescription] = useState('');
    const [newGoals, setNewGoals] = useState('');
    const [newPoints, setNewPoints] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const fetchTeam = async () => {
        if (!id) return;
        const data = await getTeamById(id);
        setTeam(data);
        setNewDescription(data.description);
        setNewGoals(data.goals);
        setNewPoints(data.points);
        setLoading(false);
    };

    useEffect(() => {
        fetchTeam();
    }, [id]);

    const handleDelete = async () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este equipo?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        const success = await deleteTeamById(id);
                        if (success) {
                            Alert.alert('Eliminado', 'El equipo ha sido eliminado correctamente', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        router.replace('/');
                                    },
                                },
                            ]);
                        } else {
                            Alert.alert('Error', 'No se pudo eliminar el equipo');
                        }
                    },
                },
            ]
        );
    };

    const handleUpdateTeam = async () => {
        const updatedTeam = { ...team, description: newDescription, goals: newGoals, points: newPoints };
        const success = await updateTeam(id, updatedTeam);
        if (success) {
            Alert.alert('Actualizado', 'El equipo ha sido actualizado correctamente');
            fetchTeam();
        } else {
            Alert.alert('Error', 'No se pudo actualizar el equipo');
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (!team) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.error}>Equipo no encontrado</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image source={{ uri: team.logo }} style={styles.teamImage} />
                <Text style={styles.teamName}>{team.name}</Text>

                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={newDescription}
                        onChangeText={setNewDescription}
                        placeholder="Editar descripción"
                    />
                ) : (
                    <Text style={styles.description}>{team.description}</Text>
                )}

                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={newGoals}
                        onChangeText={setNewGoals}
                        placeholder="Editar goles"
                    />
                ) : (
                    <Text style={styles.description}>Goles: {team.goals}</Text>
                )}

                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={newPoints}
                        onChangeText={setNewPoints}
                        placeholder="Editar puntos"
                    />
                ) : (
                    <Text style={styles.description}>Puntos: {team.points}</Text>
                )}


                {isEditing ? (
                    <Button title="Actualizar Equipo" onPress={handleUpdateTeam} />
                ) : (
                    <Button title="Editar Equipo" onPress={() => setIsEditing(true)} />
                )}

                <Button title="Eliminar Equipo" color="red" onPress={handleDelete} />

                <Text style={styles.backText} onPress={() => router.replace('/')}>
                    Volver al inicio
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
    container: { alignItems: 'center', marginTop: 20 },
    teamImage: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 },
    teamName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
    moons: { fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
    error: { fontSize: 20, color: 'red', textAlign: 'center' },
    backText: { fontSize: 18, color: '#007bff', marginTop: 20, textDecorationLine: 'underline' },
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
});