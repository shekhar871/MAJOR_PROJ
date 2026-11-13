import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { apiRequest } from '../services/api';

export default function HomeScreen() {
  const [tab, setTab] = useState('notes'); // 'notes' | 'tasks' | 'upload'
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const loadData = async () => {
    try {
      const [notesRes, tasksRes] = await Promise.all([
        apiRequest('/notes'),
        apiRequest('/tasks')
      ]);
      setNotes(notesRes);
      setTasks(tasksRes);
    } catch (err) {
      console.log('Error fetching list:', err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [tab]);

  const addNote = async () => {
    if (!title) return;
    try {
      await apiRequest('/notes', {
        method: 'POST',
        body: JSON.stringify({ title, body: content })
      });
      setTitle('');
      setContent('');
      loadData();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const addTask = async () => {
    if (!title) return;
    try {
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, description: content, priority: 'medium' })
      });
      setTitle('');
      setContent('');
      loadData();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setTab('notes')}><Text style={[styles.tabItem, tab === 'notes' && styles.activeTab]}>Notes</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('tasks')}><Text style={[styles.tabItem, tab === 'tasks' && styles.activeTab]}>Tasks</Text></TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Description / Note details" value={content} onChangeText={setContent} />
        <TouchableOpacity style={styles.addBtn} onPress={tab === 'notes' ? addNote : addTask}>
          <Text style={styles.addBtnText}>Add {tab === 'notes' ? 'Note' : 'Task'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === 'notes' ? notes : tasks}
        keyExtractor={(item) => item.note_id || item.task_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body || item.description}</Text>
            <Text style={styles.cardMeta}>{item.device_name} • {item.status || (item.is_pinned ? 'Pinned' : 'Regular')}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12, backgroundColor: '#fff', borderRadius: 8, padding: 8 },
  tabItem: { fontSize: 16, fontWeight: '600', color: '#64748b' },
  activeTab: { color: '#2563eb' },
  form: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 8, marginBottom: 8 },
  addBtn: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  cardBody: { fontSize: 14, color: '#334155', marginTop: 4 },
  cardMeta: { fontSize: 12, color: '#94a3b8', marginTop: 6 }
});
