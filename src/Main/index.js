import { useEffect, useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';

import { Text } from '../components/Text';

import AddTaskButton from '../components/AddTaskButton';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EditalTaskModal from '../components/EditTaskModal';
import Header from '../components/Header';
import NewTaskModal from '../components/NewTaskModal';
import Tasks from '../components/Tasks';

import { CenteredContainer, Container } from './styles';

import task from '../assets/images/task.png';

import { useTasksDatabase } from '../database/useTasksDatabase';

export default function Main() {
  const [tasks, setTasks] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isNewTaskModalVisible, setIsNewTaskModalVisible] = useState(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const [taskIdBeingDeleted, setTaskIdBeingDeleted] = useState();
  const [taskBeingEdited, setTaskBeingEdited] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const tasksDatabase = useTasksDatabase();

  async function getTasks() {
    setIsLoading(true);
    setTasks(await tasksDatabase.show());
    setIsLoading(false);
  }

  useEffect(() => {
    getTasks();
  }, []);

  function handleDeleteTask(id) {
    setTaskIdBeingDeleted(id);
    setIsDeleteModalVisible(true);
  }

  function handleConfirmDeleteTask() {
    tasksDatabase.remove(taskIdBeingDeleted);
    setIsDeleteModalVisible(false);
    getTasks();
  }

  function handleEditTask(task) {
    setTaskBeingEdited(task);
    setIsEditTaskModalVisible(true);
  }

  function handleChangeStatus(id) {
    tasksDatabase.updateStatus(id);
    getTasks();
  }

  function handleCreateTask(task) {
    tasksDatabase.create(task);
    setIsNewTaskModalVisible(false);
    getTasks();
  }

  function handleSaveEdit(task) {
    tasksDatabase.update(task);
    setIsEditTaskModalVisible(false);
    getTasks();
  }

  return (
    <Container>
      <Header />

      {tasks.length > 0 && !isLoading && (
        <Tasks
          tasks={tasks}
          onDelete={handleDeleteTask}
          onEditTask={handleEditTask}
          onChangeStatus={handleChangeStatus}
        />
      )}

      {isLoading && (
        <CenteredContainer>
          <ActivityIndicator size={'large'} color="#333" />
        </CenteredContainer>
      )}

      {tasks.length === 0 && !isLoading && (
        <CenteredContainer>
          <Image source={task} style={{ width: 150, height: 150 }} />

          <Text
            weight="600"
            size={20}
            opacity={0.8}
            style={{ marginTop: 16 }}
          >
            Sem Tarefas
          </Text>
          <Text opacity={0.5} style={{ marginTop: 8 }}>Não há tarefas a serem visualizadas</Text>
        </CenteredContainer>
      )}

      <AddTaskButton onPress={() => setIsNewTaskModalVisible(true)} />

      <DeleteConfirmModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDeleteTask}
      />

      <NewTaskModal
        visible={isNewTaskModalVisible}
        onClose={() => setIsNewTaskModalVisible(false)}
        onSave={handleCreateTask}
      />

      <EditalTaskModal
        visible={isEditTaskModalVisible}
        onClose={() => setIsEditTaskModalVisible(false)}
        onSave={handleSaveEdit}
        task={taskBeingEdited}
      />
    </Container>
  );
}