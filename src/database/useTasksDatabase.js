import { useSQLiteContext } from "expo-sqlite";

export function useTasksDatabase() {
  const database = useSQLiteContext();

  async function show() {
    try {
      const query = "SELECT * FROM tasks ORDER BY create_date desc";

      const response = await database.getAllAsync(query);

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function remove(id) {
    try {
      const query = `DELETE FROM tasks WHERE id = ${id}`;

      await database.execAsync(query);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStatus(id) {
    try {
      const query = `UPDATE tasks SET done = not done WHERE id = ${id}`;

      await database.execAsync(query);
    } catch (error) {
      console.log(error);
    }
  }

  async function create(task) {
    const query = `INSERT INTO tasks (title, description) VALUES ($title, $description)`;

    try {
      const statement = await database.prepareAsync(query);

      statement.executeAsync({
        $title: task.title,
        $description: task.description
      });
    } catch (error) {
      console.log(error);
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function update(task) {
    const query = `UPDATE tasks SET title = $title, description = $description WHERE id = $id`;

    try {
      const statement = await database.prepareAsync(query);

      statement.executeAsync({
        $id: task.id,
        $title: task.title,
        $description: task.description
      });
    } catch (error) {
      console.log(error);
    } finally {
      await statement.finalizeAsync();
    }

  }

  return { show, create, update, updateStatus, remove };
}