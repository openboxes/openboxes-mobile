/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { getReplenishmentTasksAction } from '../../redux/actions/replenishment';
import { ReplenishmentList, ReplenishmentTask } from '../../types/replenishment';
import { moveTaskToEnd, sortTasksByLocation } from './lib';

type ReplenishmentContextType = {
  /** The replenishment list being worked on */
  currentList?: ReplenishmentList;
  allTasks: ReplenishmentTask[];
  tasksCount: number;
  currentTask?: ReplenishmentTask;
  currentTaskIndex: number;
  /** Loads the open tasks of the list in location sequence, resolves false (after alerting) when there are none */
  startSession: (list: ReplenishmentList) => Promise<boolean>;
  startReplenishment: (callback: (response: { errorMessage?: string }) => void) => void;
  goToNextTask: () => void;
  /** Moves the current task to the end of the sequence and shows the next one */
  skipCurrentTask: () => void;
  pickCurrentTask: (outboundContainerId: string, callback: (response: { errorMessage?: string }) => void) => void;
  shortPickTask: (
    outboundContainerId: string,
    parsedQuantityPicked: number,
    callback: (response: { errorMessage?: string }) => void,
    reasonCodeId?: string
  ) => void;
  revalidateCurrentTask: (callback: (revalidatedTask?: ReplenishmentTask) => void) => void;
  revalidateTasksForOrder: (orderId: string, callback: () => void) => void;
  dropCurrentTaskAtStagingLocation: (
    task: ReplenishmentTask,
    callback: (response: { errorMessage?: string }) => void
  ) => void;
  resetReplenishmentSession: () => void;
};

const ReplenishmentContext = createContext<ReplenishmentContextType | undefined>(undefined);

export function ReplenishmentProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  const [currentList, setCurrentList] = useState<ReplenishmentList | undefined>(undefined);
  const [allTasks, setAllTasks] = useState<ReplenishmentTask[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const tasksCount = allTasks.length;
  const currentTask = currentTaskIndex < tasksCount ? allTasks[currentTaskIndex] : undefined;

  const startSession = (list: ReplenishmentList): Promise<boolean> =>
    new Promise((resolve) => {
      dispatch(
        getReplenishmentTasksAction(list.id, ({ response, errorMessage }) => {
          if (errorMessage || !response) {
            Alert.alert('Error', errorMessage ?? 'Failed to load replenishment tasks.');
            resolve(false);
            return;
          }

          if (response.errorCode) {
            Alert.alert('Error', response.message ?? 'Failed to load replenishment tasks.');
            resolve(false);
            return;
          }

          if (!response.data || response.data.length === 0) {
            Alert.alert('No Tasks', `No open replenishment tasks were found for ${list.orderNumber}.`);
            resolve(false);
            return;
          }

          setCurrentList(list);
          setAllTasks(sortTasksByLocation(response.data));
          setCurrentTaskIndex(0);
          resolve(true);
        })
      );
    });

  const skipCurrentTask = () => {
    if (tasksCount <= 1) {
      return;
    }
    setAllTasks((tasks) => moveTaskToEnd(tasks, currentTaskIndex));
    // The next task moved up into the current index; when the last task was skipped, wrap around to the first.
    if (currentTaskIndex >= tasksCount - 1) {
      setCurrentTaskIndex(0);
    }
  };

  const startReplenishment = (callback: (response: { errorMessage?: string }) => void) => {
    // TODO: Implement the logic for starting the replenishment process
    // dispatch(startReplenishmentProcess(currentTask.id, callback));
  };

  const pickCurrentTask = (outboundContainerId: string, callback: (response: { errorMessage?: string }) => void) => {
    // TODO: Implement the logic for picking the current task
    // dispatch(pickCurrentTask(currentTask.id, outboundContainerId, callback));
  };

  const shortPickTask = (
    outboundContainerId: string,
    parsedQuantityPicked: number,
    callback: (response: { errorMessage?: string }) => void,
    reasonCodeId?: string
  ) => {
    // TODO: Implement the logic for short picking the current task
    // dispatch(shortPickTask(currentTask.id, outboundContainerId, parsedQuantityPicked, callback, reasonCodeId));
  };

  const revalidateCurrentTask = (callback: (revalidatedTask?: ReplenishmentTask) => void) => {
    // TODO: Implement the logic for revalidating the current task
    // dispatch(getTaskById(currentTask.id, ({ response }) => {
    // if (response.errorCode || !response.data) {
    //   Alert.alert('Failed To Revalidate', 'Could not revalidate the current task.');
    //   return;
    // }
    //
    // const revalidatedTask = response.data;
    // setAllTasks((prevTasks) => prevTasks.map((task, index) => (index === currentTaskIndex ? revalidatedTask : task)));
    // callback?.(revalidatedTask);
    // });
  };

  const revalidateTasksForOrder = (orderId: string, callback: () => void) => {
    // TODO: Implement the logic for revalidating all tasks for the order
    // dispatch(revalidateTasksForOrderAction(orderId, ({ response }) => {
    // TODO: Handle response and update tasks accordingly
    //}));
  };

  const dropCurrentTaskAtStagingLocation = (
    task: ReplenishmentTask,
    callback: (response: { errorMessage?: string }) => void
  ) => {
    // TODO: Implement the logic for dropping the current task at the staging location
    // dispatch(dropTaskAtStagingLocation(task.outboundContainer.id, task.stagingLocation.id, callback));
  };

  const resetReplenishmentSession = () => {
    setCurrentList(undefined);
    setAllTasks([]);
    setCurrentTaskIndex(0);
  };

  const goToNextTask = () => {
    setCurrentTaskIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <ReplenishmentContext.Provider
      value={{
        currentList,
        allTasks,
        tasksCount,
        currentTaskIndex,
        currentTask,
        startSession,
        startReplenishment,
        goToNextTask,
        skipCurrentTask,
        pickCurrentTask,
        shortPickTask,
        revalidateCurrentTask,
        revalidateTasksForOrder,
        dropCurrentTaskAtStagingLocation,
        resetReplenishmentSession
      }}
    >
      {children}
    </ReplenishmentContext.Provider>
  );
}

export function useReplenishmentContext() {
  const context = useContext(ReplenishmentContext);
  if (!context) {
    throw new Error('useReplenishmentContext must be used within a ReplenishmentProvider');
  }
  return context;
}
