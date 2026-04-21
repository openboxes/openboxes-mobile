import * as React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { navigate, resetToRoutes } from '../../NavigationService';
import {
  dropPickTaskAction,
  getPickTaskByIdAction,
  getPickTasksAction,
  getPickTasksByRequisitionAction,
  pickPickTaskAction,
  shortPickTaskAction,
  startPickTaskAction
} from '../../redux/actions/picking';
import { DeliveryType, PickTask } from '../../types/picking';

type PickingContextType = {
  /** The list of all tasks for this session */
  tasks: PickTask[];
  /** Setter for the list of tasks */
  setTasks: React.Dispatch<React.SetStateAction<PickTask[]>>;
  /** The index of the task currently being worked on */
  currentTaskIndex: number;
  /** Setter for the current task index */
  setCurrentTaskIndex: React.Dispatch<React.SetStateAction<number>>;
  /** The derived object for the active task */
  currentTask: PickTask | undefined;
  /** Total number of tasks in the session */
  allTasksCount: number;
  /** Starts a new picking session, returns whether it was successful */
  startSession: (deliveryType: DeliveryType, ordersCount: number) => Promise<boolean>;
  /** Completes the current pick task. */
  pickCurrentTask: (outboundContainerId: string, callback: (response: { errorMessage?: string }) => void) => void;
  /** Resets state to initial values */
  resetSession: () => void;
  /** Handles short pick for the current task */
  shortPickTask: (
    outboundContainerId: string | null,
    parsedQuantityPicked: number,
    callback: (response: { errorMessage?: string }) => void,
    reasonCodeName?: string
  ) => void;
  /** Revalidates all tasks for a given requisition ID */
  revalidateTasksForRequisition: (requisitionId: string | undefined, callback?: () => void) => void;
  /** Start the pick task (API call) */
  startPickTask: (callback: (response: { errorMessage?: string }) => void) => void;
  /** Drop the current pick task at the staging location */
  dropCurrentTask: (task: PickTask, callback?: (response: { errorMessage?: string }) => void) => void;
  /** Revalidates the current pick task details from the server */
  revalidateCurrentTask: (callback?: (task: PickTask | undefined) => void) => void;
  /** Advances to the next task in the list */
  goToNextTask: () => void;
};

const PickingContext = React.createContext<PickingContextType | undefined>(undefined);

export function PickingProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<PickTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = React.useState<number>(0);
  const dispatch = useDispatch();
  const allTasksCount = tasks.length;
  const currentTask = allTasksCount > 0 && currentTaskIndex < allTasksCount ? tasks[currentTaskIndex] : undefined;

  const startSession = async (deliveryType: DeliveryType, ordersCount: number): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch(
        getPickTasksAction({ deliveryTypeCode: deliveryType.code, ordersCount }, ({ response, errorMessage }) => {
          if (errorMessage || !response) {
            Alert.alert('Error', errorMessage ?? 'Failed to load pick tasks.');
            resolve(false);
            return;
          }

          if (response.errorCode) {
            Alert.alert('Error', response.message ?? 'Failed to load pick tasks.');
            navigate('PickingPickType');
            resolve(false);
            return;
          }

          if (!response.data || response.data.length === 0) {
            Alert.alert('No Tasks', 'No pick tasks were found for the selected criteria.');
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

  const shortPickTask = (
    outboundContainerId: string | null,
    parsedQuantityPicked: number,
    callback: (response: { errorMessage?: string }) => void,
    reasonCodeName?: string
  ) => {
    if (!currentTask || parsedQuantityPicked === undefined) {
      Alert.alert('Error', 'Missing required fields for short pick.');
      return;
    }

    dispatch(shortPickTaskAction(currentTask.id, outboundContainerId, parsedQuantityPicked, callback, reasonCodeName));
  };

  const revalidateCurrentTask = (callback?: (task: PickTask | undefined) => void) => {
    if (!currentTask) {
      return;
    }

    dispatch(
      getPickTaskByIdAction(currentTask.id, ({ response, errorMessage }) => {
        if (errorMessage || !response?.data) {
          Alert.alert('Error', errorMessage ?? 'Failed to revalidate the current pick task.');
          callback?.(undefined);
          return;
        }

        const updatedTask = response.data;
        setTasks((prevTasks) => prevTasks.map((task, index) => (index === currentTaskIndex ? updatedTask : task)));
        callback?.(updatedTask);
      })
    );
  };

  const goToNextTask = () => {
    setCurrentTaskIndex((prevIndex) => prevIndex + 1);
  };

  const revalidateTasksForRequisition = (requisitionId: string | undefined, callback?: () => void) => {
    if (!requisitionId) {
      Alert.alert('Error', 'Requisition ID is required to revalidate tasks.');
      return;
    }

    dispatch(
      getPickTasksByRequisitionAction(requisitionId, (res) => {
        if ('errorMessage' in res || !res.response?.data) {
          Alert.alert('Error', 'Failed to revalidate pick tasks for the requisition.');
          return;
        }

        const newTasks = res.response.data;

        if (newTasks.length === 0) {
          const hasNextExistingTask = currentTaskIndex + 1 < tasks.length;

          if (hasNextExistingTask) {
            goToNextTask();
            callback?.();
            return;
          }

          Alert.alert('No Additional Tasks', 'No new pick tasks were created. Proceeding to staging location drop.', [
            {
              text: 'OK',
              onPress: () =>
                resetToRoutes([
                  { name: 'Drawer', params: { screen: 'Dashboard' } },
                  { name: 'PickingPickStagingLocation' }
                ])
            }
          ]);
          return;
        }

        setTasks((prevTasks) => {
          const existingIds = new Set(prevTasks.map((task) => task.id));

          const uniqueNewTasks = newTasks.filter((task) => !existingIds.has(task.id));

          return [...prevTasks, ...uniqueNewTasks];
        });

        goToNextTask();
        callback?.();
      })
    );
  };

  const dropCurrentTask = (task: PickTask, callback?: (response: { errorMessage?: string }) => void) => {
    if (!task) {
      Alert.alert('Task Missing', 'No current task to drop.');
      return;
    }

    if (!task.stagingLocation?.id) {
      Alert.alert('Missing Input', 'Current task is missing a valid Staging Location.');
      return;
    }

    if (!task.outboundContainer?.id) {
      Alert.alert('Error', 'Current task does not have a valid Outbound Container.');
      return;
    }

    dispatch(dropPickTaskAction(task.outboundContainer.id, task.stagingLocation.id, callback));
  };

  const resetSession = () => {
    setTasks([]);
    setCurrentTaskIndex(0);
  };

  return (
    <PickingContext.Provider
      value={{
        tasks,
        setTasks,
        currentTaskIndex,
        setCurrentTaskIndex,
        currentTask,
        allTasksCount,
        startSession,
        pickCurrentTask,
        shortPickTask,
        resetSession,
        revalidateTasksForRequisition,
        startPickTask,
        dropCurrentTask,
        revalidateCurrentTask,
        goToNextTask
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
