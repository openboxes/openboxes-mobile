import * as React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { navigate } from '../../NavigationService';
import {
  dropPickTaskAction,
  getPickTaskByIdAction,
  getPickTasksAction,
  pickPickTaskAction,
  startPickTaskAction
} from '../../redux/actions/picking';
import { DeliveryType, PickTask } from '../../types/picking';

type PickingContextType = {
  /** The list of all tasks for this session */
  tasks: PickTask[];

  /** The index of the task currently being worked on */
  currentTaskIndex: number;

  /** The derived object for the active task */
  currentTask: PickTask | undefined;

  /** Total number of tasks in the session */
  allTasksCount: number;

  /** Starts a new picking session, returns whether it was successful */
  startSession: (deliveryType: DeliveryType, ordersCount: number) => Promise<boolean>;

  /**
   * Completes the current pick task.
   */
  pickCurrentTask: (outboundContainerId: string, callback: (response: { errorMessage?: string }) => void) => void;

  /** Resets state to initial values */
  resetSession: () => void;

  /** Handle partial pick for the current task */
  handlePartialPick: () => void;

  /** Start the pick task (API call) */
  startPickTask: (callback: (response: { errorMessage?: string }) => void) => void;

  /** Drop the current pick task at the staging location */
  dropCurrentTask: (stagingLocationId: string) => void;

  /** Revalidates the current pick task details from the server */
  revalidateCurrentTask: (callback?: (task: PickTask) => void) => void;
};

const PickingContext = React.createContext<PickingContextType | undefined>(undefined);

export function PickingProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<PickTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = React.useState<number>(0);
  const dispatch = useDispatch();
  const allTasksCount = tasks.length;
  const currentTask = allTasksCount > 0 ? tasks[currentTaskIndex] : undefined;

  const startSession = async (deliveryType: DeliveryType, ordersCount: number): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch(
        getPickTasksAction({ deliveryTypeCode: deliveryType.code, ordersCount }, ({ response }) => {
          if (response.errorCode) {
            Alert.alert('Error', response.message ?? 'Failed to load pick tasks.');
            navigate('PickingPickType');
            resolve(false);
            return;
          }

          if (!response.data || response.data.length === 0) {
            Alert.alert('No Tasks', 'No pick tasks were found for the selected criteria.');
            navigate('PickingPickType');
            resolve(false);
            return;
          }

          setTasks(response.data);
          setCurrentTaskIndex(0);
          resolve(true);
        })
      );
    });
  };

  const startPickTask = (callback: (response: { errorMessage?: string }) => void) => {
    if (!currentTask) {
      return;
    }

    dispatch(startPickTaskAction(currentTask.id, callback));
  };

  const pickCurrentTask = (outboundContainerId: string, callback: (response: { errorMessage?: string }) => void) => {
    if (!currentTask) {
      return;
    }

    dispatch(pickPickTaskAction(currentTask.id, outboundContainerId, callback));
  };

  const revalidateCurrentTask = (callback?: (task: PickTask) => void) => {
    if (!currentTask) {
      return;
    }

    dispatch(
      getPickTaskByIdAction(currentTask.id, ({ response }) => {
        if (response.errorCode || !response.data) {
          Alert.alert('Error', 'Failed to revalidate the current pick task.');
          return;
        }

        const updatedTask = response.data;
        setTasks((prevTasks) => prevTasks.map((task, index) => (index === currentTaskIndex ? updatedTask : task)));
        callback?.(updatedTask);
      })
    );
  };

  const dropCurrentTask = (stagingLocationId: string) => {
    if (!currentTask) {
      Alert.alert('Task Missing', 'No current task to drop.');
      return;
    }

    if (!stagingLocationId) {
      Alert.alert('Missing Input', 'Please scan or enter a valid Staging Location ID.');
      return;
    }

    if (!currentTask.outboundContainer) {
      Alert.alert('Error', 'Current task does not have a valid outbound container.');
      return;
    }

    dispatch(dropPickTaskAction(currentTask.outboundContainer.id, stagingLocationId));
  };

  // TODO: Implement partial pick logic
  const handlePartialPick = () => {};

  const resetSession = () => {
    setTasks([]);
    setCurrentTaskIndex(0);
  };

  return (
    <PickingContext.Provider
      value={{
        tasks,
        currentTaskIndex,
        currentTask,
        allTasksCount,
        startSession,
        pickCurrentTask,
        resetSession,
        handlePartialPick,
        startPickTask,
        dropCurrentTask,
        revalidateCurrentTask
      }}
    >
      {children}
    </PickingContext.Provider>
  );
}

export function usePickingContext() {
  const context = React.useContext(PickingContext);
  if (!context) {
    throw new Error('usePickingContext must be used within a PickingProvider');
  }
  return context;
}
