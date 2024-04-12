import { View, Text, Button, StyleSheet, TextInput, Pressable, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIRESTORE_DB } from '../../firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

export interface Todo{
    title: string;
    done: boolean;
    id: string;
}

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {

    const [todos, setTodos] = useState<Todo[]>([]);
    const [todo, setTodo] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    
    useEffect(() => {
        const unsubscribeAuth = getAuth().onAuthStateChanged((user) => {
          if (user) {
            const q = query(collection(FIRESTORE_DB, "todos"), where("userID", "==", user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const fetchedTodos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              })) as Todo[];
              setTodos(fetchedTodos);
            });
            return () => unsubscribe(); // Unsubscribe from Firestore when the user logs out
          }
        });
      
        return () => unsubscribeAuth(); // Cleanup auth listener when component unmounts
      }, []);
      

    const addTodo = async () => {
        if (!todo.trim()) return;
    
        try {
            await addDoc(collection(FIRESTORE_DB, 'todos'), {
                title: todo,
                done: false,
                userID: user?.uid
            }); 
            setTodo('');
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    }
    
    const TodoItem = ({ item }) => {
        const [username, setUsername] = useState('');
        const auth = getAuth();
        const db = getFirestore(); // Ensure you've initialized Firestore correctly
      
        useEffect(() => {
          const fetchUsername = async () => {
            if (item.userID) {
              const userRef = doc(db, `users/${item.userID}`);
              const userSnap = await getDoc(userRef);
      
              if (userSnap.exists()) {
                setUsername(userSnap.data().username);
              } else {
                console.log("No such user document!");
              }
            }
          };
      
          fetchUsername();
        }, [item.userID]);
      
        const toggleDone = async () => {
          const ref = doc(db, `todos/${item.id}`);
          await updateDoc(ref, { done: !item.done });
        };
      
        const deleteItem = async () => {
          const ref = doc(db, `todos/${item.id}`);
          await deleteDoc(ref);
        };
      
        return (
          <View style={styles.todoContainer}>
            <TouchableOpacity style={styles.todo} onPress={toggleDone}>
              {item.done ? <Ionicons name="checkmark-circle-outline" size={24} color="green" /> : <Ionicons name="ellipse-outline" size={24} color="grey" />}
              <View>
                <Text style={styles.todoText}>{item.title}</Text>
                <Text style={styles.createdByText}>Created by {username}</Text>
              </View>
            </TouchableOpacity>
            <Ionicons name="trash-outline" size={24} color="red" onPress={deleteItem} />
          </View>
        );
      };
    return (

    <View style={styles.container}>
        <FlatList
            data={todos}
            keyExtractor={(todo: Todo) => todo.id}
            renderItem={({ item }) => <TodoItem item={item} />}

        />
        <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Add new todo" onChangeText={(text: string) => setTodo(text)} value={todo}/>
            <Pressable style={styles.button} onPress={addTodo} disabled={todo===''}>
                <Text style={styles.text}>Add Todo</Text>
            </Pressable>
        </View>
        
    </View>

  )
}

export default List

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 20,
        flex: 1,},
    form: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginRight:10,
        borderWidth: 1,
        height: 50,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'white',
        borderColor: 'blue',
        borderWidth: 1,
    },
    text: {
        color: 'blue',
        fontWeight: 'bold',
    },
    todoContainer:{
        flexDirection: 'row',
        backgroundColor: '#fffff',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        height: 50,
        padding: 10,
        borderRadius: 50,
    },
    todoText:{
        paddingHorizontal: 5,
    },
    createdByText: {
        paddingHorizontal: 5,
        fontSize: 12,
        fontStyle: 'italic'
    },
    todo:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

})